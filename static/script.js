$(document).ready(function(){
    //User registration
    $('#register-submit').click(function(event){
        event.preventDefault();
        var full_name = $('#register-full-name').val();
        var email = $('#register-email').val();
        var username = $('#register-username').val();
        var password = $('#register-password').val();

        if(full_name.length < 1){
            $('.status-message').text('Please enter your name!');
        }
        else if(!validateEmail(email)){
            $('.status-message').text('Invalid email');
        }
        else if(password.length < 5 || password.length > 25){
            $('.status-message').text('Password length must be between 5 to 25 characters.');
        }
        else if(username.length < 3 || username.length > 15){
            $('.status-message').text('Username length must be between 3 to 15 characters.');
        }
        else{
            $.ajax({
                url: '/api',
                type: 'POST',
                data: {action: 'check_username', username: username }
            }).done(function(data){
                if(data['status'] != 'unique'){
                    $('.status-message').text(data['message']);
                }
                else{
                    $.ajax({
                        url: '/api',
                        type: 'POST',
                        data: {action: 'check_email', email: email}
                    }).done(function(data){
                        if(data['status'] != 'unique'){
                            $('.status-message').text(data['message']);
                        }
                        else{
                            $.ajax({
                                url: '/api',
                                type: 'POST',
                                data: {
                                    action: 'register_candidate',
                                    full_name: full_name,
                                    email: email,
                                    password: password,
                                    username: username
                                }
                            }).done(function(data){
                                if(data['status'] != 'success'){
                                    $('.status-message').text(data['message']);
                                }
                                else{
                                    $('.status-message').css('color', 'lightgreen')
                                    .text('Registration successful, you will be redirected to login withing 5 seconds...');
                                    setTimeout(function(){
                                        window.location.href="/";
                                    }, 5000);
                                }
                            });
                        }
                    })
                }
            });
        }
    });

    //User Login
    $('#login-submit').click(function(event){
        event.preventDefault();
        var email = $('#login-email').val();
        var password = $('#login-password').val();
        var user_type = $('#login-selector').val();

        if(!validateEmail(email)){
            $('.status-message').text("Invalid email!");
        }
        else if(password.length < 5 || password.length > 25){
            $('.status-message').text("Invalid password!");
        }
        else{
            $.ajax({
                url: '/api',
                type: 'POST',
                data: {
                    action: user_type+'_login',
                    email: email,
                    password: password
                },
            }).done(function(data){
                if(data['status'] == 'success'){
                    setCookie('auth_token', data['auth_token'], 5);
                    setCookie('user_type', user_type, 5);
                    window.location.reload();
                }
                else{
                    $('.status-message').text(data['message']);
                }
            }).fail(function(xhr, ajaxOptions, thrownError){
                $('.status-message').text(thrownError);
            })
        }
    });
    $('#user-logout').click(function(event){
        event.preventDefault();
        var auth_token = getCookie('auth_token');
        $.ajax({
            url: '/',
            type: 'POST',
            data: { action: 'user_logout', auth_token: auth_token }
        }).done(function(data){
            setCookie('auth_token', '', -5);
            setCookie('user_type', '', -5);
            window.location.reload();
        });
    })

    //Update user information
    if($('#user-welcome').length){
        var auth_token = getCookie('auth_token');
        $.ajax({
            url: 'api',
            type: 'POST',
            data: {action: 'get_user_info', auth_token: auth_token }
        }).done(function(data){
            if(data['status'] == 'success'){
                if(data['user_type'] == 'candidate'){
                    $('#user-welcome').text("Welcome "+data['name']);
                    //Update profile info
                    if($('#candidate_id').length){
                        $('#candidate_id').text(data['id']);
                        $('#candidate_name').text(data['name']);
                        $('#candidate_email').text(data['email']);
                        $('#candidate_username').text(data['username']);
                        $('#candidate_phone').text(data['phone']);
                        $('#candidate_cv_link').text(data['cv_link']);
                        if(data['position_id'])
                            $('#candidate_position').text(data['position']['name']);
                        else 
                            $('#candidate_position').text("None");
                        var approval = (data['approval']) ? 'Approved' : 'Not Approved';
                        $('#candidate_approval').text(approval);
                    }
                }
                else if(data['user_type'] == 'hr'){
                    $('#user-welcome').text("Welcome "+data['name']);
                }
            }
        })
    }

    if(getCookie('user_type') == 'candidate'){
        $('#candidate_phone').hover(function(){
            var text = $(this).text();
            var button = '<button class="data-change-btn" id="change-candidate-phone">Change</button>';
            $(this).append(button);
        }, function(){
            $(this).find('button').remove();
        })
        $('#candidate_cv_link').hover(function(){
            var text = $(this).text();
            var button = '<button class="data-change-btn" id="change-candidate-cv-link">Change</button>';
            $(this).append(button);
        }, function(){
            $(this).find('button').remove();
        })
        $('#candidate_position').hover(function(){
            var text = $(this).text();
            var button = '<button class="data-change-btn" id="change-candidate-position">Change</button>';
            $(this).append(button);
        }, function(){
            $(this).find('button').remove();
        })
    }

    $('#candidate_phone').on('click', '#change-candidate-phone', function(){
        var auth_token = getCookie('auth_token');
        var new_phone = prompt("Please provide new phone number");
        if(new_phone === null){

        }
        else if(new_phone.length > 4 && new_phone.length < 15){
            $.ajax({
                url: '/api',
                type: 'POST',
                data: { action: 'update_candidate_phone', auth_token: auth_token, phone: new_phone }
            }).done(function(data){
                if(data['status'] == 'success'){
                    window.location.reload();
                }
                else{
                    alert(data['message']);
                }
            })
        }
        else{
            alert("Invalid phone number!");
        }
    });
    $('#candidate_cv_link').on('click', '#change-candidate-cv-link', function(){
        var auth_token = getCookie('auth_token');
        var cv_link = prompt("Please provide new CV link");
        if(cv_link === null){

        }
        else if(cv_link.length > 0){
            $.ajax({
                url: '/api',
                type: 'POST',
                data: { action: 'update_candidate_cv', auth_token: auth_token, cv_link: cv_link }
            }).done(function(data){
                if(data['status'] == 'success'){
                    window.location.reload();
                }
                else{
                    alert(data['message']);
                }
            })
        }
        else{
            alert("Invalid CV Link!");
        }
    });
    $('#candidate_position').on('click', '#change-candidate-position', function(){
        var _this = $(this);
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {action: 'get_positions'}
        }).done(function(data){
            if(data['status'] == 'success'){
                var html = '<select id="position-selector" class="position-selector">';
                html += '<option value="">Please select an option</option>';
                for(let key in data['positions']){
                    html += '<option value="'+data['positions'][key]['id']+'">'+data['positions'][key]['name']+'</option>';
                }
                html += '</select>';
                _this.parent().html(html);
            }
        })
    });
    $('#candidate_position').on('change', '#position-selector', function(){
        var position_id = $(this).val();
        var auth_token = getCookie('auth_token');
        if(position_id.length > 0){
            $.ajax({
                url: '/api',
                type: 'POST',
                data: {action: 'update_candidate_position', auth_token: auth_token, position_id: position_id}
            }).done(function(data){
                window.location.reload();
            });
        }
    });
    if($('.users-table').length){
        var auth_token = getCookie('auth_token');
        $.ajax({
            url: '/api',
            type: 'POST',
            data: {action: 'get_candidates', auth_token: auth_token}
        }).done(function(data){
            if(data['status'] == 'success'){
                var html = '';
                for(key in data['candidates']){
                    if(data['candidates'][key]['approval'] == null || data['candidates'][key]['approval'] == 0)
                        html += '<tr class="not_approved">';
                    else
                        html += '<tr>';
                    html += '<td>'+data['candidates'][key]['id']+'</td>';
                    html += '<td>'+data['candidates'][key]['full_name']+'</td>';
                    html += '<td>'+data['candidates'][key]['email']+'</td>';
                    html += '<td><a href="/hr-user.html?candidate_id='+data['candidates'][key]['id']+'"><button class="table-cell-button">Manage</button></a></td>';
                    html += '</tr>';
                }
                $('.users-table').find('table').html(html);
            }
        })
    }
    if($('.user-details-table').length){
        var auth_token = getCookie('auth_token');
        var candidate_id = getParameterByName('candidate_id');
        if(candidate_id.length > 0){
            $.ajax({
                url: '/api',
                type: 'POST',
                data: { action: 'get_candidate_info', auth_token: auth_token, candidate_id: candidate_id}
            }).done(function(data){
                if(data['status'] == 'success'){
                    $('#candidate_details_id').text(data['id']);
                    $('#candidate_details_name').text(data['name']);
                    $('#candidate_details_email').text(data['email']);
                    $('#candidate_details_username').text(data['username']);
                    $('#candidate_details_phone').text(data['phone']);
                    $('#candidate_details_cv_link').text(data['cv_link']);
                    if(data['position_id'])
                        $('#candidate_details_position').text(data['position']['name']);
                    else 
                        $('#candidate_details_position').text("None");

                    if(data['approval'] == null || data['approval'] == 0){
                        $('#candidate_details_approval').text("Not Approved");
                        var html = '<button class="table-cell-btn" id="candidate-approval" data-id="'+data['id']+'" data-approval="1">Approve</button>';
                        $('#candidate_details_approval').append(html);
                    }
                    else{
                        $('#candidate_details_approval').text("Approved");
                        var html = '<button class="table-cell-btn" id="candidate-approval" data-id="'+data['id']+'" data-approval="0">Disapprove</button>';
                        $('#candidate_details_approval').append(html);
                    }
                    
                }
            })
        }
    }
    $('#candidate_details_approval').on('click', '#candidate-approval', function(){
        var auth_token = getCookie('auth_token');
        var user_id = $(this).data('id');
        var approval = $(this).data('approval');

        $.ajax({
            url: '/api',
            type: 'POST',
            data: { action: 'update_candidate_approval', auth_token: auth_token, candidate_id: user_id, approval: approval}
        }).done(function(data){
            if(data['status'] == 'success'){
                window.location.reload();
            }
        })
    });
})



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}