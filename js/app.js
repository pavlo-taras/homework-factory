var rows = [
  {
    firstName: "John",
    lastName: "Doe",
    salary: 1000,
    position: "Manager"
  },
  {
    firstName: "Pavlo",
    lastName: "Taras",
    salary: 1500,
    position: "Team Leader"
  }
];

var headers = ['№', 'First name', 'Last name', 'Salary', 'Position'];

var limitEmployee = 10;

var $ = function(selector) {
  return document.querySelectorAll(selector);
} 

function buildTable($table, rows, headers) {
  // add headers
  $table.appendChild(
    createRow(
      addElement('div', {class: "table_row table_row-header"}),
      headers,
      {class: "table_cell"}
    )
  )

  // add row for form
  var formNewEmployee = $('form.data')[0];
  var rowForForm = addElement('div', {class: "table_row table_row table_row-create"});
  var cellForForm = addElement('div', {class: "table_cell"});
  cellForForm.appendChild(formNewEmployee); 
  rowForForm.appendChild(cellForForm);
  $table.appendChild(rowForForm);

  // add data rows
  for (var i = 0, row; i < rows.length; i++) {
    row = Object.assign({'index': i + 1}, rows[i])

    $table.appendChild(
      createRow(
        addElement('div', {class: "table_row", "data-row": "employee"}),
        row,
        {class: "table_cell"}
      )
    ) 
  }

  // add footer - Number Of Employes
  $table.appendChild(
    createRow(
      addElement('div', {class: "table_row table_row-footer"}),
      ['Number Of Employes', ''],
      {class: "table_cell"}
    )
  );
  printNumberEmployees();

  // add footer
  $table.appendChild(
    createRow(
      addElement('div', {class: "table_row table_row-footer"}),
      ['Average salary', ''],
      {class: "table_cell"}
    )
  );
  printAvarageSalary();
}

function extractHeaders(rows) {
  var headers = [];
  rows.forEach(function(item){
    var keys = Object.keys(item);
    
    keys.forEach(function(key) {
      if (!(key in headers)) {
        headers.push(key)
      }
    });
  })
  return headers;
};

function createRow($tableRow, row, options) {  
  console.log(row);

  for (var item in row) {
    console.log('item', item);
    $tableRow.appendChild(addElement('div', Object.assign(options, {"data-cell" : item, innerHTML: row[item]})));
  }

  return $tableRow;
}

function addElement(tag, attributes) {
  var $el = document.createElement(tag);

  for (attribute in attributes) {
    if (attribute == 'innerHTML') {
      $el.innerHTML = attributes[attribute];
    } else {
      $el.setAttribute(attribute, attributes[attribute])
    };
  }

  return $el;
}

// create div.table
$('main')[0].appendChild(addElement('div', {class: 'table'}));

// build table with header and rows
var $table = $('.table')[0];
buildTable($table, rows, headers)

// forms New employee / New Limit
var formNewEmployee = $('form.data')[0],
    formNewLimit = $('form.limit')[0];

var btnAddNewEmployee = $('.addNewEmployee')[0],
    btnSaveEmployee = $('.saveFormEmployee')[0],
    btnCancelEmployee = $('.cancelFormEmployee')[0],
    btnNewLimit = $('.newLimit')[0],
    btnSaveLimit = $('.saveFormLimit')[0],
    btnCancelLimit = $('.cancelFormLimit')[0];

btnAddNewEmployee.classList.add('visible-inline');
btnAddNewEmployee.disabled = canAddNewEmployee() || countNumberEmployees() > limitEmployee;
btnAddNewEmployee.addEventListener('click', function(e) {
  btnAddNewEmployee.classList.remove('visible-inline');

  btnSaveEmployee.classList.add('visible-inline');
  btnCancelEmployee.classList.add('visible-inline');

  formNewEmployee.classList.add('fadeInDown', 'flex');
  
  setTimeout(function () {
    formNewEmployee.classList.remove('fadeInDown');
  }, 1000);
});

btnSaveEmployee.addEventListener('click', function(e) {

  if (formNewEmployee.checkValidity()) {
    var data = [];

    for (var element of $('form.data > input')) {
      data[element.name] = element.value;
    }

    $('.table_row:not(.table_row-header):not(.table_row-footer)')[countNumberEmployees()-1].after(
      createRow(
        addElement('div', {class: "table_row", "data-row": "employee"}),
        data,
        {class: "table_cell"}
      )
    )
      
    printNumberEmployees()
    printAvarageSalary();

    btnAddNewEmployee.classList.add('visible-inline');
    btnAddNewEmployee.disabled = canAddNewEmployee() || countNumberEmployees() > limit;
    btnSaveEmployee.classList.remove('visible-inline');
    btnCancelEmployee.classList.remove('visible-inline');
  
    formNewEmployee.classList.remove('flex');

    for (var element of formNewEmployee.elements) {
      element.value = '';
    }

    e.preventDefault();
  } else {
    formNewEmployee.reportValidity();
  }
});

btnCancelEmployee.addEventListener('click', function(e) {
  
  for (var element of $('form.data > input')) {
    element.value = '';
  }

  btnAddNewEmployee.classList.add('visible-inline');
  btnSaveEmployee.classList.remove('visible-inline');
  btnCancelEmployee.classList.remove('visible-inline');

  formNewEmployee.classList.remove('flex');
});

btnNewLimit.classList.add('visible-inline');
btnNewLimit.addEventListener('click', function(e) {

  formNewLimit.classList.add('fadeInRight', 'visible-inline');
  
  btnNewLimit.classList.remove('visible-inline');

  btnSaveLimit.classList.add('visible-inline');
  btnCancelLimit.classList.add('visible-inline');

  setTimeout(function () {
    formNewLimit.classList.remove('fadeInRight');
  }, 1000);
});

btnSaveLimit.addEventListener('click', function(e) {

  if (formNewLimit.checkValidity()) {
    limitEmployee = formNewLimit.elements['changeLimit'].value;
  
    btnNewLimit.classList.add('visible-inline');
    btnSaveLimit.classList.remove('visible-inline');
    btnCancelLimit.classList.remove('visible-inline');
  
    formNewLimit.classList.remove('visible-inline');

    printNumberEmployees();

    e.preventDefault();
  } else {
    formNewLimit.reportValidity();
  }
});

btnCancelLimit.addEventListener('click', function(e) {
  
  formNewLimit.elements['changeLimit'].value = '';
  
  btnNewLimit.classList.add('visible-inline');
  btnSaveLimit.classList.remove('visible-inline');
  btnCancelLimit.classList.remove('visible-inline');

  formNewLimit.classList.remove('flex');
});

function countNumberEmployees() {
  return $('.table_row[data-row=employee]').length;
}

function printNumberEmployees() {
  $('.table_row.table_row-footer :last-child')[0].innerText = countNumberEmployees() + '/' + limitEmployee;
}

function avarageSalary() {
  var sum = 0,
      items = $('.table_row[data-row=employee] [data-cell=salary]');

  for (var item of items) {
    sum += parseInt(item.innerText);
  }

  return sum / countNumberEmployees();
}

function printAvarageSalary() {
  $('.table_row.table_row-footer :last-child')[1].innerText = avarageSalary();
}

function canAddNewEmployee() {
  console.log(avarageSalary() > 2000);
  return avarageSalary() > 2000;
}
