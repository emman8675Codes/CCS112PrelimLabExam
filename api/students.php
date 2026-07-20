<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");


$host = "db";
$user = "root";
$pass = "rootpassword";
$dbname = "school_db";


try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}


$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM students ORDER BY id DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;


    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['name']) && !empty($data['email']) && !empty($data['course'])) {
            $stmt = $pdo->prepare("INSERT INTO students (name, email, course) VALUES (?, ?, ?)");
            $stmt->execute([$data['name'], $data['email'], $data['course']]);
            echo json_encode(["message" => "Student added successfully!"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "All fields are required"]);
        }
        break;


    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['id']) && !empty($data['name']) && !empty($data['email']) && !empty($data['course'])) {
            $stmt = $pdo->prepare("UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['email'], $data['course'], $data['id']]);
            echo json_encode(["message" => "Student updated successfully!"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid data provided"]);
        }
        break;


    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!empty($data['id'])) {
            $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["message" => "Student deleted successfully!"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID required"]);
        }
        break;
}
?>
