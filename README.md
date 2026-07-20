# Student Loan & Payment Management System

A web-based relational application designed to support **Student Management**, **Student Loan Management**, and **Payment Loan Management**. This project was developed as part of the Prelim Laboratory Exam for **CCS112 – Application Development and Emerging Technologies** at Pamantasan ng Cabuyao.

---

## 📁 Repository & Folder Structure

```text
student-crud-system/
├── api/
│   ├── students.php      # Backend API for Student CRUD
│   ├── loans.php         # Backend API for Loan Operations & Status Updates
│   └── payments.php      # Backend API for Payment Tracking & Balance Calculation
├── app/
│   ├── app.js            # Frontend logic for Student Management & Navigation
│   ├── loans.js          # Frontend logic for Loan Workspace & Status Badges
│   └── payments.js       # Frontend logic for Payment Tracking & Overpayment Rules
├── styles/
│   └── style.css         # Custom UI styling, responsive layout, and status badges
├── schema.sql            # Complete relational database schema (MySQL)
├── index.html            # Main SPA container and Workspace views
└── README.md             # Project documentation and setup guide
