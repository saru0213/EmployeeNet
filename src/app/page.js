import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Users, Filter } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-sky-900 mb-4">
            Employee Management System
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto">
            Simplify your employee data management with powerful CRUD operations and intuitive search/filter features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* CRUD Operations */}
          <Card className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <CardTitle className="text-2xl font-semibold text-sky-800">Easy Employee CRUD Operations</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Effortlessly create, read, update, and delete employee records using an intuitive interface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Quickly manage your team’s information in just a few clicks.</p>
            </CardContent>
          </Card>

          {/* Search & Filter */}
          <Card className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Search className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-2xl font-semibold text-sky-800">Powerful Search & Filter</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Easily find specific employee records using advanced search and filter options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Search employees by name, role, department, and more to quickly access their details.</p>
            </CardContent>
          </Card>

          {/* Data Insights */}
          <Card className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Filter className="h-12 w-12 text-purple-500 mb-4" />
              <CardTitle className="text-2xl font-semibold text-sky-800">Filter by Categories</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Organize employee records by department, role, or any other category for easy management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Filter and view employee data based on specific criteria, ensuring you find the right information faster.</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link href="/employees">
            <Button
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg transition-colors"
            >
              Start Managing Employees
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
