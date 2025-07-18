import EmployeeManager from "../Components/EmployeeManager";





export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-sky-800 ">
          Employee Management System
        </h1>
        <EmployeeManager />
      </div>
    </div>
  );
}
