///////////////// PRELOADER //////////////

$(window).on("load", function () {
    if ($("#preloader").length) {
        $("#preloader")
            .delay(1000)
            .fadeOut("slow", function () {
                $(this).remove();
            });
    }
});

// FUNCTIONS TO LOAD ON PAGE

$(window).on("load", (function () {
    getAll();
    getAllDepartmentsDD();
    getAllDepartmentsTab();
    getAllLocations();
}))

// STAFF TABLE SEARCHING

$(document).ready(function () {
    $("#staffSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#staffTable tr ").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }
    
    );
});

// DEPARTMENT FILTER ON STAFF TAB

$(document).ready(function () {

    $("#staffDeptFilter").on("change", function () {
        var value = $('#staffDeptFilter option:selected').text().toLowerCase();
        $("#staffTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

// DEPARTMENT TABLE SEARCHING

$(document).ready(function () {
    $("#departmentSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#departmentTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

// LOCATION TABLE SEARCHING

$(document).ready(function () {
    $("#locationSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#locationTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});


////////////////////////////////// POPULATING TABLES ///////////////////////////////

// POPULATING STAFF TABLE

function getAll() {
    $.ajax({
        url: "libs/php/getAll.php",
        async: true,
        global: false,
        type: 'GET',
        dataType: 'JSON',
        data: {

        },
        success: function (response) {
            $("#staffTable").text("");
            // console.log(response)
            
            response.data.forEach(staff => {
                $("#staffTable").append(`
                <tr>
                <td id="personName"><div class='d-inline-flex w-75 overflow-auto'>${staff.firstName + " " + staff.lastName}</div></td>
                <td class="col-dep"><div class='d-inline-flex w-75  col-dep'>${staff.department}</div></td>
                <td class="col-loc tableHide"><div class='d-inline-flex w-75 col-loc'>${staff.location}</div></td>
                <td class="tableHide"><div class='d-md-inline-flex'>${staff.email}</div></td>
                <td><div class="d-flex">
                <button type="button" class="btn btn-success editPersonBtn mx-auto" data-bs-toggle="modal" data-bs-target="#editPerson" data-id="${staff.id}title="Edit"><i class="fa-solid fa-pen-to-square" style="color: #ffffff;"></i></button>
                <button type="button" class="btn btn-danger deletePerson mx-auto" title="Delete"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
                <td class="d-none">All Departments</td>
               
                <td class="d-none" id="personId" >${staff.id}</td>
                <td class="d-none" id="deptId" >${staff.departmentId}</td>
                <td class="d-none" id="jobTitleTest">${staff.jobTitle}</td>
                </div></td></tr>`)
            })
        },
        error: function() {
            alertify.error('Error getting data.'); 
        }
    })
}

// POPULATING DEPARTMENT DROPDOWNS

function getAllDepartmentsDD() {
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        async: false,
        global: false,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {

            $(".departments").text("");
            $(".departments").append(`<option value="getAll" selected>All Departments</option>`);

            let data = response.data
            data.sort((a, b) => a.name.localeCompare(b.name)); // sorting alphabetically 

            data.forEach(sec => {
                $(".departments").append(`<option value=${sec.id}>${sec.name}</option>`);
            });

            $('#insertNewPerson select option[value="getAll"]').attr("value", "");
        },
        error: function() {
            alertify.error('Error getting data.'); 
        }


    })
}

// POPULATING DEPARTMENTS TABLE

function getAllDepartmentsTab() {
    $.ajax({
        url: 'libs/php/getAllDepartmentsSec.php',
        async: false,
        global: false,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {
            $("#departmentTable").text("");

            response.data.forEach(dep => {
                $("#departmentTable").append(`
                <tr><td class="tableHide d-none"><div class='d-inline-flex w-75 overflow-auto '>${dep.departmentId}</div></td>
                <td><div class='d-inline-flex w-75 overflow-auto '>${dep.department}</div></td>
                <td><div class='d-inline-flex w-75'>${dep.location}</div></td>                
                <td><div class="d-flex"><button type="button" class="btn btn-success editDepartmentBtnImg editDepartmentBtn mx-auto" data-bs-toggle="modal" data-bs-target="#editDepartment" data-id="${dep.departmentId}" id="${dep.locationId}"title="Edit"><i class="fa-solid fa-pen-to-square" style="color: #ffffff;"></i></button>
                <button type="button" class="btn btn-danger deleteDepartmentBtnImg deleteDepartment mx-auto" title="Delete" data-id="${dep.departmentId}" id="${dep.departmentId}"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
                <form id="deleteDepForm">
                <td class="d-none" id="deptTabId" >${dep.departmentId}</td>
                <td class="d-none" id="locDeptTabId" >${dep.locationId}</td>
                <input class="d-none" type="number" value=${dep.departmentId} hidden/><input class="d-none" type="number" value=${dep.locationId} /></form></div></td></tr>`);
            })

            $('#insertNewPerson select option[value="getAll"]').attr("value", "");
            $('#insertNewDepartment select option[value="getAll"]').attr("value", "");
            $('#insertNewLocation select option[value="getAll"').attr("value", "");
        },
        error: function() {
            alertify.error('Error getting data.'); 
        }
    })
}

// POPULATING LOCATION DROPDOWN AND TABLE

function getAllLocations() {
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        async: false,
        global: false,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {
            $(".locations").text("");
            $("#locationTable").text("");
            $(".locations").append(`<option value="getAll" selected>All Locations</option>`);

            let data = response.data
            data.forEach(loc => {
                $(".locations").append(`<option value=${loc.id}>${loc.name}</option>`);

                $("#locationTable").append(`
                <tr><td class="d-none"><div class='d-inline-flex w-75 overflow-auto'>${loc.id}</div></td>
                <td><div class='d-inline-flex w-75'>${loc.name}</div></td>                
                <td><div class="d-flex"><button type="button" class="btn btn-success updateLocBtn mx-auto" data-bs-toggle="modal" data-bs-target="#editLocation" data-id="${loc.id}" title="Edit"><i class="fa-solid fa-pen-to-square" style="color: #ffffff;"></i></button>
                <button type="button" class="btn btn-danger deleteLocationBtn mx-auto" title="Delete"  data-id="${loc.id}"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
                <input class="d-none" type="number" value=${loc.id} /><input class="d-none" type="number" value=${loc.id} /></div></td></tr>`);
            });

            $('#insertNewPerson select option[value="getAll"]').attr("value", "");
            $('#insertNewDepartment select option[value="getAll"]').attr("value", "");
            $('#insertNewLocation select option[value="getAll"').attr("value", "");
        },
        error: function() {
            alertify.error('Error getting data.'); 
        }
    })
}

////////////////////////////////// ADD STAFF, DEPARTMENTS & LOCATIONS ////////////////////////////////

// ADD STAFF

$("#addPerson").submit(function (e) {
    e.preventDefault(); // prevents normal submit behaviour

    alertify.confirm('Are you sure you want to add a new Staff Member?').setHeader('Attention!').set('onok', function(closeEvent) {
        // closeEvent.preventDefault();

        $.ajax({
            type: "POST",
            url: "libs/php/insertPersonnel.php",
            data: $("#addPerson").serialize(), // info from addPerson form
            success: function (response) {
                if (response) {
                    $("#newStaffResponse").html("<div class='alert alert-success'>Successfully Added Staff Member</div")
                            setTimeout(function () { // success message w/ timeout
                                $("#newDeptResponse").hide();
                            }, 5000);
                    
                    $("#addPerson")[0].reset(); // resets the addPerson form
                    getAll(); // reloads the table
                }
            },
            error: function() {
                alertify.error('Error getting data.');  // error if no data received
            }
        })
    });

    return false; // preventing form submission normally
});
        

// ADD DEPARTMENT 

$("#addDepartment").submit(function (e) {
    e.preventDefault(); // prevents normal submit behaviour

    alertify.confirm('Are you sure you want to add a new Department?').setHeader('Attention!').set('onok', function(closeEvent) {
              
                $.ajax({
                    type: "POST",
                    url: "libs/php/insertDepartment.php",
                    data: $("#addDepartment").serialize(), // info from addDepartment form

                    success: function (response) {
                        if (response) {
                    
                            $("#newDeptResponse").html("<div class='alert alert-success'>Successfully Added Department</div")
                            setTimeout(function () { // success message w/ timeout
                                $("#newDeptResponse").hide();
                            }, 5000);
                                                     
                            $("#addDepartment")[0].reset(); // resets the addDepartment form
                            getAllDepartmentsTab(); // reloads the table
                            getAll();
                            getAllDepartmentsDD();
                         
                        }
                    },
                    error: function() {
                        alertify.error('Error getting data.');  // error if no data received
                    }
                })
                });
                return false; // preventing form submission normally
            });


// ADD LOCATION

$("#addLocation").submit(function (e) {
    e.preventDefault();  // prevents normal submit behaviour

    alertify.confirm('Are you sure you want to add a new Location?').setHeader('Attention!').set('onok', function(closeEvent) {

                $.ajax({
                    type: "POST",
                    url: "libs/php/insertLocation.php",
                    data: $("#addLocation").serialize(), // info from addLocation form

                    success: function (response) {
                        if (response) {
                           
                            $("#newLocResponse").html("<div class='alert alert-success'>Successfully Added Location</div")
                            setTimeout(function () { // success message w/ timeout
                                $("#newLocResponse").hide();
                            }, 5000);
                            $("#addLocation")[0].reset(); // resets the addLocation form
                            getAllLocations(); // reloads the table
                      
                        }
                    },
                    error: function() {
                        alertify.error('Error getting data.');  // error if no data received
                    }
                })
                });
                return false; // preventing form submission normally
            });

////////////////////////////////// EDIT STAFF, DEPARTMENTS & LOCATIONS ////////////////////////////////

// EDIT STAFF 

$("#editPersonForm").submit(function (e) {
    e.preventDefault(); // prevents normal submit behaviour

    var personIDtoBeUpdate = $('#personId').text()
    // console.log(personIDtoBeUpdate)


    alertify.confirm('Are you sure you want to edit this Staff Member?').setHeader('Attention!').set('onok', function(closeEvent) { 
   
                $.ajax({
                    type: "POST",
                    url: "libs/php/editPerson.php",
                    data: $("#editPersonForm").serialize() + "&id=" + personIDtoBeUpdate,  // new info from editPersonForm form plus their id to update
                    success: function (response) {
                        
                        if (response) {
                            // $("#editStaffResponse").html("<div class='alert alert-success'>Successfully Edited Staff Member</div")
                            // setTimeout(function () { // success message w/ timeout
                            //     $("#editStaffResponse").hide();
                            // }, 5000);

                            $('#editPerson').modal('hide')
                            alertify.set('notifier','position', 'top-right');
                        
                            alertify.success('Successfully updated Staff Member.')
                                                  
                            $("#editPersonForm")[0].reset(); // resets the editPersonForm form
                            getAll(); // reloads the table
                            // getAllDepartmentsDD();
                            // getAllDepartmentsTab();
                       
                        }
                    },
                    error: function() {
                        alertify.error('Error getting data.');  // error if no data received
                    }
                })
                });
                return false; // preventing form submission normally
            });

            

// POPULATING EDIT MODAL W/ STAFF DATA

// $(document).on("click", ".editPersonBtn", function () {
//     globalThis.personIDtoBeUpdate = $(this).closest("tr").find("#personId").text(); // selects the tr element & gets personId
//     console.log(globalThis.personIDtoBeUpdate);

//     let personDepId = $(this).closest("tr").find("#deptId").text(); // selects the tr element & gets deptId
//     console.log(personDepId);


//     $("#editPersonForm select").val(personDepId).trigger("change"); // triggers the change event

//     let fullName = $($(this).closest("tr").find("td")[0]).children("div").text().split(/(?=[A-Z])/); // splits text content into 2 parts

//     $('#editPersonForm input[name="firstName"]').attr("value", fullName[0]); // sets the value of the input methods vv
//     $('#editPersonForm input[name="lastName"]').attr("value", fullName[1]);
//     $('#editPersonForm input[name="email"]').attr("value", $($(this).closest("tr").find("td")[3]).children("div").text());
//     $('#editPersonForm input[name="jobTitle"]').attr("value", $($(this).closest("tr").find("td")[8]).text());

// })

/// NEW EDIT STAFF POPULATING W/ DATA
$('#editPerson').on('shown.bs.modal', function() {
    $('#editFirstName').focus()
})

$('#editPerson').on('show.bs.modal', function(e) {

    $.ajax({
        url: 'libs/php/getPersonnelByID.php',
        type: 'POST',
        data: {
            id:
$(e.relatedTarget).attr('data-id')
        },
        success: function (result) {
            // console.log(result)
            // console.log(result.data.personnel[0].firstName)
            var personIDtoBeUpdate = result.data.personnel[0].id
            // console.log(personIDtoBeUpdate)
            var resultCode = result.status.code

            if (resultCode == 200) {
                $('#personId').val(result.data.personnel[0].id);
                $('#editPersonForm input[name="firstName"]').val(result.data.personnel[0].firstName);
                $('#editPersonForm input[name="lastName"]').val(result.data.personnel[0].lastName);
                $('#editPersonForm input[name="jobTitle"]').val(result.data.personnel[0].jobTitle);
                $('#editPersonForm input[name="email"]').val(result.data.personnel[0].email);

                $('#department').html('');
                $.each(result.data.department, function() {
                    $('department').append($("<option>", {
                        value: this.id,
                        text: this.name
                    }));
                })

                $('#editDept').val(result.data.personnel[0].departmentID);
            } else {
                alertify.error('Error getting data.');  // error if no data received
            }


            },
            error: function() {
                alertify.error('Error getting data.');  // error if no data received

        }})})
       

// EDIT DEPARTMENT 

$('#editDepartment').on('shown.bs.modal', function() {
    $('#editDepartmentName').focus()
})


$("#editDepartmentForm").submit(function (e) {
    e.preventDefault(); // prevents normal submit behaviour

    alertify.confirm('Are you sure you want to edit this Department?').setHeader('Attention!').set('onok', function(closeEvent) { 

                $.ajax({
                    type: "POST",
                    url: "libs/php/editDepartment.php",
                    data: $("#editDepartmentForm").serialize(), // new info from editDepartmentForm form

                    success: function (response) {
                      
                        // console.log(response)
                        if (response) {

                            $('#editDepartment').modal('hide')
                            alertify.set('notifier','position', 'top-right');
                        
                            alertify.success('Successfully updated Department.')
                            getAllDepartmentsTab();


                            // $("#editDeptResponse").html("<div class='alert alert-success'>Successfully Edited Department</div")
                            // setTimeout(function () { // success message w/ timeout
                            //     $("#editDeptResponse").hide();
                            // }, 5000);

                            $("#editDepartmentForm")[0].reset(); // resets the editDepartmentform
                            $("#editDepartmentForm input[name='name']").attr("value", $($(this).closest("tr").find("td")[1]).children("div").text());
                            getAllDepartmentsDD(); // reloads the table
                       
                        }
                    },
                    error: function() {
                        alertify.error('Error getting data.');  // error if no data received
                    }
                })
                });
                return false; // preventing form submission normally
            });

// $("#editDepartmentForm select.departments").change(function () { // listens for change event 
  
//     $.ajax({
//         type: "POST",
//         url: "libs/php/getDepartmentByID.php",
//         data: { id: $(this).val() }, // id of the department in the select input
//         success: function (response) {
//             // console.log(response)
//             let locationByID = response.data[0].locationID; // assigning locationid to location id of the department
//             $(`#editDepartmentForm select.locations option[value=${locationByID}]`).prop("selected", true); //selects the option in the select that has the same value as the above variable
//         }
//     });

//     let department = $("#editDepartmentForm select.departments option:selected").text();
//     $("#editDepartmentForm input").attr("value", department); // assigned to the departments select input
// });

// // POPULATING EDIT MODAL W/ DEPARTMENT DATA

// $(document).on("click", ".editDepartmentBtn", function () {
  
//     getAllDepartmentsDD(); // populating dropdown 
//     let row = $(this).closest("tr").find("td");
//     let rowId = $(row).eq(0).text();
//     // console.log(rowId);
//     $("#editDepartmentForm select").val(rowId).trigger("change"); //sets the select value to the department id

// })

/// NEW EDIT DEPARTMENT POPULATING W/ DATA

$('#editDepartment').on('show.bs.modal', function(e) {
    $.ajax({
        url: 'libs/php/getDepartmentByID.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $(e.relatedTarget).attr('data-id')
        },
        success: function (result) {
            // console.log(result)

            var resultCode = result.status.code
            if (resultCode == 200) {
                $('#editDepartmentSelect').val(result.data[0].id)
                $('#editDepartmentName').val(result.data[0].name);
                $('#editDepartmentLocation').val(result.data[0].locationID)
            } else {
                alertify.error('Error getting data.');  // error if no data received
            }


            },
            error: function() {
                alertify.error('Error getting data.');  // error if no data received

        }})})
    


// EDIT LOCATION 

// $("#editLocationForm select").change(function () { // populates input of editLocationForm to location being edited
//     let location = $("#editLocationForm select option:selected").text();
//     $("#editLocationForm input").attr("value", location);
// })

$("#editLocationForm").submit(function (e) {
    e.preventDefault(); // prevents normal submit behaviour

    alertify.confirm('Are you sure you want to edit this Location').setHeader('Attention!').set('onok', function(closeEvent) { 

                $.ajax({
                    type: "POST",
                    url: "libs/php/editLocation.php",
                    data: $("#editLocationForm").serialize(), // new info from editLocationForm form

                    success: function (response) {
                        if (response) {

                            $('#editLocation').modal('hide')
                            alertify.set('notifier','position', 'top-right');
                        
                            alertify.success('Successfully updated Location.')
                          
                            // $("#editLocResponse").html("<div class='alert alert-success'>Successfully Edited Location</div")
                            // setTimeout(function () { // success message w/ timeout
                            //     $("#editLocResponse").hide();
                            // }, 5000);
                            $("#editLocationForm")[0].reset(); // resets the editLocationform
                            $("#editLocationForm input").attr("value", "");
                            getAllLocations(); // reloads the table
                        }
                    },
                    error: function() {
                        alertify.error('Error getting data.');  // error if no data received
                    }
                })
                });
                return false; // preventing form submission normally
            });
                

// $(document).on("click", ".updateLocBtn", function () { 

//     let row = $(this).closest("tr").find("td");
//     let rowId = $(row).eq(0).text();
//     //console.log(rowId);
//     $("#editLocationForm select").val(rowId).trigger("change"); // changing the value of the locationID select input in the editLocationForm form

// })


// new edit location populating test thingy lol
$('#editLocation').on('shown.bs.modal', function() {
    $('#editLocationName').focus()
})

$('#editLocation').on('show.bs.modal', function (e) {
    $.ajax({
        url: 'libs/php/getLocById.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: 
            $(e.relatedTarget).attr('data-id')
        },
        success: function (result) {
            // console.log(result)
            var resultCode = result.status.code
            if (resultCode == 200) {
            $('#editLocationSelect').val(result.data[0].id)
            $('#editLocationName').val(result.data[0].name)
        } else {
            alertify.error('Error getting data.');  // error if no data received
        }


        },
        error: function() {
            alertify.error('Error getting data.');  // error if no data received

    }})})
   


////////////////////////////////// DELETE STAFF, DEPARTMENTS & LOCATIONS ////////////////////////////////

// DELETE STAFF 

$(document).on("click", ".deletePerson", function (e) {
    e.preventDefault(); // prevents normal submit behaviour

    let personIDtoBeDelete = $(this).closest("tr").find("#personId").text();
    let person = $(this).closest("tr").find("td");
    let personName = $(person).eq(0).text();
  
    alertify.confirm(`Are you sure you want to delete ${personName}?`).setHeader('Attention!').set('onok', function(closeEvent) { 

                $.ajax({
                    type: "POST",
                    url: "libs/php/deletePerson.php",
                    data: { id: personIDtoBeDelete }, //  id info from variables above

                    success: function (response) {
                    
                        getAll();  // reloads the table
                        alertify.set('notifier','position', 'top-right');
                    
                        alertify.success(`Successfully deleted ${personName}.`)
                    },
              
                error: function() {
                    alertify.error('Error getting data.');  // error if no data received
                }
            })
            });
            return false; // preventing form submission normally
})


// DELETE DEPARTMENT 

$(document).on("click", ".deleteDepartment", function (e) {
    e.preventDefault(); // prevents normal submit behaviour


    let depToBeDeleted = $(this).closest("tr").find("#deptTabId").text();
    // console.log(depToBeDeleted)

    $.ajax({
        url: "libs/php/deleteDepartment.php",
        type: "POST",
        dataType: "JSON",
        data: {
            id: parseInt($(this).attr("data-id")) //  id info from variables above
        },
        success: function (response) {
         
            let depName = response.data[0].departmentName;
            let depCount = response.data[0].departmentCount
            
        

            if (response.status.code == 200) {
                if (response.data[0].departmentCount == 0) {

                    alertify.confirm(`Are you sure you want to delete ${depName}? <br>This cannot be undone.`).setHeader('Attention!').set('onok', function(closeEvent) { 
                                                           

                                $.ajax({
                                    type: "POST",
                                    url: "libs/php/deleteDepartmentByID.php",
                                    data: { id: depToBeDeleted },

                                    success: function (response) {
                                      
                                        getAllDepartmentsTab(); // reloads the table
                                        getAllDepartmentsDD();
                                        alertify.set('notifier','position', 'top-right');
                    
                        alertify.success(`Successfully deleted ${depName}.`)
                                    }})})

                 
                } else {
                    
                  
                    alertify.set('notifier','position', 'top-right');
                    
                    alertify.error(`Cannot delete ${depName} due to ${depCount} dependant Employees.`)
                    
                }
            } else {
                alertify.error('Error getting data.'); 
            }
        },
        error: function() {
            alertify.error('Error getting data.'); 
        }
    })
})

// DELETE LOCATION 

    // DELETE LOCATION TEST
    $(document).on("click", ".deleteLocationBtn", function (e) {
        e.preventDefault();  // prevents normal submit behaviour
    
        let locToBeDeleted = parseInt($(this).attr("data-id"));
      
        $.ajax({
            url: "libs/php/deleteLocation.php",
            type: "POST",
            dataType: "JSON",
            data: {
                id: parseInt($(this).attr("data-id")) //  id info from variables above
            },
            success: function (response) {
             
            
                let locName = response.data[0].locationName;
                let locCount = response.data[0].locationCount;
                
             
    
                if (response.status.code == 200) {
                    if (response.data[0].locationCount == 0) {
    
                        alertify.confirm(`Are you sure you want to delete ${locName}? <br>This cannot be undone.`).setHeader('Attention!').set('onok', function(closeEvent) { 
                                                                
    
                                    $.ajax({
                                        type: "POST",
                                        url: "libs/php/deleteLocationByID.php",
                                        data: { id: locToBeDeleted },
    
                                        success: function (response) {
                                         
                                            getAllLocations(); // reloads the table
                                            alertify.set('notifier','position', 'top-right');
                        
                            alertify.success(`Successfully deleted ${locName}.`)
                        }})})
                    } else {
                        
                        alertify.set('notifier','position', 'top-right');
                        
                        alertify.error(`Cannot delete ${locName} due to ${locCount} dependant Departments.`)
                    }
                } else {
                    alertify.error('Error getting data.'); 
                    
                }
            },
    
            error: function() {
                alertify.error('Error getting data.'); 
            }
        })})







