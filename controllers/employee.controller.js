const Employee = require("../models/employee.model");
const pdf = require("html-pdf");
const fs = require("fs");
const options = { format: "A4" };

// test function
exports.test = function A(req, res) {
  res.render("test");
};

// Add new Employee function
exports.add = function A(req, res) {
  res.render("employee/employeeAdd");
};

exports.update = async function(req, res) {
  let employee = await Employee.findOne({ _id: req.params.id });
  res.render("employee/employeeUpdate", {
    employee
  });
};

exports.create = (req, res) => {
  let employee = new Employee({
    
    name: req.body.name,
    city: req.body.city,
    mobile: req.body.mobile
  });

  employee.save(function(err) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont insert employee .." });
    }
    req.flash("employee_add_success_msg", "New  employee added successfully");
    res.redirect("/employee/all");
  });
};

exports.details = (req, res) => {
  Employee.findById(req.params.id, function(err, employee) {
    if (err) {
      return res.status(400).json({
        err: `Oops something went wrong! Cannont find employee with ${req.params.id}.`
      });
    }
    res.render("employee/employeeDetail", {
      employee
    });
  });
};

exports.all = (req, res) => {
  Employee.find(function(err,employees) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find employees." });
    }
    res.status(200).render("employee/employeeAll", {
      employees,
    });
    //res.send(employees);
  });
};

// Post Update to insert data in database
exports.updateEmployee = async (req, res) => {
  let result = await Employee.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont update employee with ${req.params.id}.`
    });
  req.flash("employee_update_success_msg", "employee updated successfully");
  res.redirect("/employee/all");
};

exports.delete = async (req, res) => {
  let result = await Employee.deleteOne({ _id: req.params.id });
  if (!result)
    return res.status(400).json({
      err: `Oops something went wrong! Cannont delete Employee with ${req.params.id}.`
    });
  req.flash("employee_del_success_msg", "Employee has been deleted successfully");
  res.redirect("/employee/all");
};

exports.allReport = (req, res) => {
  Employee.find(function(err, employees) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find employees." });
    }
    res.status(200).render(
      "reports/employee/allEmployee",
      {
        employees
       
      },
      function(err, html) {
        pdf
          .create(html, options)
          .toFile("uploads/allEmployees.pdf", function(err, result) {
            if (err) return console.log(err);
            else {
              var datafile = fs.readFileSync("uploads/allEmployees.pdf");
              res.header("content-type", "application/pdf");
              res.send(datafile);
            }
          });
      }
    );
  });
};
