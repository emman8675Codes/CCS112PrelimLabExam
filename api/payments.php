<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");


$pdo = new PDO("mysql:host=db;dbname=school_db", "root", "rootpassword");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {
    case 'GET':
        $loan_id = $_GET['loan_id'] ?? null;
        if ($loan_id) {
            // Get loan amount
            $stmtLoan = $pdo->prepare("SELECT amount FROM loans WHERE id = ?");
            $stmtLoan->execute([$loan_id]);
            $loan = $stmtLoan->fetch(PDO::FETCH_ASSOC);


            // Get payments
            $stmtPayments = $pdo->prepare("SELECT * FROM payments WHERE loan_id = ? ORDER BY id DESC");
            $stmtPayments->execute([$loan_id]);
            $payments = $stmtPayments->fetchAll(PDO::FETCH_ASSOC);


            // Calculate totals
            $totalPaid = array_sum(array_column($payments, 'amount'));
            $remainingBalance = ($loan ? $loan['amount'] : 0) - $totalPaid;


            echo json_encode([
                "loan_amount" => $loan ? $loan['amount'] : 0,
                "total_paid" => $totalPaid,
                "remaining_balance" => max(0, $remainingBalance),
                "payments" => $payments
            ]);
        }
        break;


    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['loan_id']) && !empty($data['amount']) && !empty($data['payment_date']) && !empty($data['payment_method'])) {
            $stmt = $pdo->prepare("INSERT INTO payments (loan_id, amount, payment_date, payment_method) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['loan_id'], $data['amount'], $data['payment_date'], $data['payment_method']]);
            echo json_encode(["message" => "Payment recorded successfully!"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid payment payload"]);
        }
        break;
}
?>
