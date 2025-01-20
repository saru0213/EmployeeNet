import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [employees] = await connection.execute("SELECT * FROM employees");
    connection.release();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const employeeData = await request.json();
    const connection = await pool.getConnection();

    // Check if email already exists
    const [
      existingEmployees,
    ] = await connection.execute("SELECT id FROM employees WHERE email = ?", [
      employeeData.email,
    ]);

    if (existingEmployees.length > 0) {
      connection.release();
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // If email doesn't exist, proceed with insertion
    const [
      result,
    ] = await connection.execute(
      "INSERT INTO employees (first_name, last_name, email, phone, department, position, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.email,
        employeeData.phone,
        employeeData.department,
        employeeData.position,
        employeeData.hire_date,
        employeeData.salary,
      ]
    );
    connection.release();

    return NextResponse.json(
      { message: "Employee created successfully", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const employeeData = await request.json();
    const connection = await pool.getConnection();

    // Check if email exists for other employees
    const [
      existingEmployees,
    ] = await connection.execute(
      "SELECT id FROM employees WHERE email = ? AND id != ?",
      [employeeData.email, employeeData.id]
    );

    if (existingEmployees.length > 0) {
      connection.release();
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    await connection.execute(
      "UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, department = ?, position = ?, hire_date = ?, salary = ? WHERE id = ?",
      [
        employeeData.first_name,
        employeeData.last_name,
        employeeData.email,
        employeeData.phone,
        employeeData.department,
        employeeData.position,
        employeeData.hire_date,
        employeeData.salary,
        employeeData.id,
      ]
    );
    connection.release();

    return NextResponse.json(
      { message: "Employee updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const connection = await pool.getConnection();

    await connection.execute("DELETE FROM employees WHERE id = ?", [id]);
    connection.release();

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
