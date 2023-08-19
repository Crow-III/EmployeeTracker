import inquirer from 'inquirer';
import connection from './db/index.js'; // Import the connection object from the correct path

// Rest of your code

async function start() {
  try {
    const answer = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all departments',
        'View all roles',
        'Add employee',
        'Add department',
        'Add role',
        'Exit'
      ]
    });

    switch (answer.action) {
      case 'View all employees':
        const employeeResults = await connection.query('SELECT * FROM employee');
        console.table(employeeResults);
        await start();
        break;

      case 'View all departments':
        const departmentResults = await connection.query('SELECT * FROM department');
        console.table(departmentResults);
        await start();
        break;

      case 'View all roles':
        const roleResults = await connection.query('SELECT * FROM role');
        console.table(roleResults);
        await start();
        break;

      case 'Add employee':
        const employeeData = await inquirer.prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "Enter the employee's first name:",
          },
          {
            name: 'last_name',
            type: 'input',
            message: "Enter the employee's last name:",
          },
          {
            name: 'role_id',
            type: 'input',
            message: "Enter the employee's role ID:",
          },
          {
            name: 'manager_id',
            type: 'input',
            message: "Enter the employee's manager ID:",
          },
        ]);
        
        await connection.query('INSERT INTO employee SET ?', employeeData);
        console.log('Employee added successfully!');
        await start();
        break;

      case 'Add department':
        const departmentData = await inquirer.prompt([
          {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:',
          },
        ]);
        
        await connection.query('INSERT INTO department SET ?', departmentData);
        console.log('Department added successfully!');
        await start();
        break;

      case 'Add role':
        const roleData = await inquirer.prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role:',
          },
          {
            name: 'department_id',
            type: 'input',
            message: 'Enter the department ID for the role:',
          },
        ]);
        
        await connection.query('INSERT INTO role SET ?', roleData);
        console.log('Role added successfully!');
        await start();
        break;

      case 'Exit':
        connection.end();
        break;
    }
  } catch (err) {
    console.error(err);
    connection.end();
  }
}

(async () => {
  try {
    await connection.connect();
    console.log('Connected to MySQL database');
    await start();
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
})();
