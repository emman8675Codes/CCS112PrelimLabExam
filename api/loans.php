<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");


$pdo = new PDO("mysql:host=db;dbname=school_db", "root", "rootpassword");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {
    case 'GET':
        $student_id = $_GET['student_id'] ?? null;
        if ($student_id) {
            $stmt = $pdo->prepare("SELECT * FROM loans WHERE student_id = ? ORDER BY id DESC");
            $stmt->execute([$student_id]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;


    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['student_id']) && !empty($data['amount']) && !empty($data['type']) && !empty($data['status'])) {
            $stmt = $pdo->prepare("INSERT INTO loans (student_id, amount, type, status) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['student_id'], $data['amount'], $data['type'], $data['status']]);
            echo json_encode(["message" => "Loan added successfully!"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Incomplete loan parameters"]);
        }
        break;


    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['id']) && !empty($data['status'])) {
            $stmt = $pdo->prepare("UPDATE loans SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(["message" => "Loan status updated successfully!"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid status data"]);
        }
        break;
}
