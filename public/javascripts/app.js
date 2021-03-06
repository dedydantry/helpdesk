$(document).ready(function(){
    // notifikasi
    var url = $('body').data('host');
    function notifikasi(type, string){
        var html = '<div class="notif "><div class="alert alert-'+type+'" role="alert"><strong>'+string+'</strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button></div></div>';
        $('body').append(html)
        $('.notif').animate({
            bottom:'30px',
            opacity:1
        }, 1000, function(){
            setTimeout(function(){
                $('.notif').animate({
                    opacity:0
                }, 1000);
            }, 2000);
        })
    }
    // end notification
    // delete user

    $(document).on('submit', '#form-delete-user', function (e) {
        e.preventDefault();
        var url =  $(this).attr('action')
        var parent = $(this).parent('td').parent('tr')
        swal({
            title: "Are you sure?",
            text: "To delete this user?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: true,
            showLoaderOnConfirm: true,
        }, function (isConfirm) {
            if (isConfirm) {
                $.post(url, function (data) {
                    if (data.status == 'success') {
                        parent.fadeOut('slow')
                        swal("Deleted!", " has been delete", "success")
                        return;
                    }
                    swal("Failed!", " Failed to delete", "danger")
                    return;
                })
            }
            else {
                swal("Cancelled")
            }
        })

       
    })

    $(document).on('submit', '#form-comment', function(e){
        e.preventDefault();
        var url = $(this).attr('action');
        var data = $(this).serialize();
        var $this = $(this);
        $.post(url, data, function(status){
            var firstchild = $('.comment-list .card').first();
            if(firstchild.hasClass('card')){
                $(status).insertBefore(firstchild).hide().fadeIn('slow')
                notifikasi('info', 'Comment has been saved');
                $this[0].reset()
            }
            else{
                return $('.comment-list').append(status).fadeIn('slow');
                notifikasi('danger', 'Failed , try again');
            }
        })
    })

    $('.edit-comment').click(function(e){
        e.preventDefault();
        var parent = $(this).parent('div').parent('div').parent('div');
        parent.children('.c-first-child').addClass('c-hidden');
        parent.children('.field-edit-comment').hide().removeClass('c-hidden').show()
    })

    $('.edit-cancel').click(function(e){
        var parent = $(this).parent('div').parent('form').parent('div').parent('div');
        parent.children('.field-edit-comment').addClass('c-hidden')
        parent.children('.c-first-child').removeClass('c-hidden');
    })

    $(document).on('submit', '.form-edit.comment', function(e){
        e.preventDefault();
        var url = $(this).attr('action');
        var data = $(this).children('.form-group').children('textarea').val()
        var $this = $(this);
        console.log('wkjk')
           
       
        $.post(url, {comment : data}, function(status){
            if(status.status == 'success'){
                var parent = $this.parent('div').parent('div');
                parent.children('.text-muted').children('p').text(data)
                parent.children('.field-edit-comment').addClass('c-hidden')
                parent.children('.c-first-child').removeClass('c-hidden');
                notifikasi('info', 'Comment has been update');
            } else{
                notifikasi('danger', 'Failed to update comment, try again');
            }
        })
    })

    $('.delete-comment').click(function(){
        var id = $(this).data('target');
        var parent = $(this).parent('div').parent('div').parent('div');
        $.post(url+'comment/destroy/'+id, {'data' : true}, function(status){
            console.log(status)
            if(status.status == 'success'){
                parent.fadeOut('slow');
                notifikasi('info', 'Comment has been delete');
            }
        })
    })

    // delete ticket
    $('a.ticket-delete').click(function(e){
        e.preventDefault()
        var parent = $(this).parent('div').parent('div').parent('td').parent('tr');
        var id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "To delete this ticket?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: true,
            showLoaderOnConfirm: true,
        }, function(isConfirm) {
            if(isConfirm){
               $.post(url+'ticket/delete/'+id, function(status){
                   if(status.status == 'success'){
                        parent.fadeOut('slow');
                        swal("Deleted!"," has been delete", "success")
                   } else {
                        swal("Failed!"," failed delete", "danger")
                   }
               })
            }
            else {
                swal("Cancelled")
            }
        })
    })

    // change status
    $('.btn-change').click(function(e){
        e.preventDefault();
        var status = $(this).data('sts');
        var url = $(this).attr('href');
        var $this = $(this);
        swal({
            title: "Are you sure?",
            text: "Start Progress",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Submit!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: true,
            showLoaderOnConfirm: true,
        }, function(isConfirm) {
            if(isConfirm){
               $.post(url, {'status' : status}, function(status){
                   if(status.status == 'success'){
                       $this.text('On Progress');
                       $this.removeClass('btn-outline-primary').addClass('btn-outline-secondary')
                        swal("Change!"," Status has been Change", "success")
                   } else {
                        swal("Failed!"," failed", "danger")
                   }
               })
            }
            else {
                swal("Cancelled")
            }
        })
    })

    $('.btn-rate').click(function(e){
        e.preventDefault()
        $('.complete-ticket').attr('data-ticket', $(this).data('ticket'))
        $('.complete-ticket').attr('data-user', $(this).data('user'))
        $('#exampleModalCenterTitle').text('Please Rate "'+ $(this).data('name')+'"');
        $('#modal-rate').modal()
    })

    $('.rate li').mouseenter(function(){
        // var target = $(this).children('i');
        var index = $(this).index();
        for (var i = 0; i <= index; i++) {
            $('.rate li').children().eq(i).removeClass('fa-heart-o on').addClass('fa-heart');
        }
    }).mouseleave(function(){
        if($('.rate li').children().hasClass('on')){

        }else{

        $('.rate li').children().removeClass('fa-heart').addClass('fa-heart-o');
        }
    })

    $('.rate li').click(function(){
        var index = $(this).index();
        for (var i = 0; i <= index; i++) {
            $('.rate li').children().eq(i).removeClass('fa-heart-o').addClass('fa-heart on');
        }       
    })

    function generateRating(rates){
        var string ='';
        for (var i = 1; i <= 5; i++) {
            if(i<=rates){
                string += '<li><i class="fa fa-heart"></i></li>';
            }else{
                string += '<li><i class="fa fa-heart-o"></i></li>';
            }
        }
        return string;
    }

    $('.complete-ticket').click(function(){
        var rate = $('.rate li i.on').length
        var ticket = $(this).data('ticket');
        var user = $(this).data('user');
        if(rate>0){
            $.post(url+'ticket/completes', {'rate' : rate, 'ticket_id':ticket, 'user_id':user}, function(data){
                if(data.status == 'success'){
                    $('.footer-menu').html("<ul class='rating'>"+generateRating(rate)+"</ul>")
                    $('#modal-rate').modal('hide')
                }
            })
        } else {
            swal("Failed!"," Please add rate", "warning");
        }
    })
    // data table
    $('.ticket-table').DataTable({
        // "bSort": false,
        dom: 'Bfrtip',
        buttons: [
            'print'
        ]
    })

    // update password
    $(document).on('submit', 'form.update-password', function(e){
        e.preventDefault();
        var action = $(this).attr('action');
        var data = $(this).serialize()
        $.post(action, data, function(data){
            console.log(data)
            if(data.status == 'success'){
                swal('success', 'Password has been change', 'success');
                setTimeout(function(){
                    window.location.href=base_url+'logout';
                },2000)
            }
        })
    })

    function generatePriority(priority){
        if(priority == 1){
            return 'Hight';
        } else if(priority == 2){
            return 'Normal';
        } else{
            return 'Low';
        }
    }

    function generateStatusTicket(status){
        if(status == 1){
            return 'Complette';
        } else if(status == 2){
            return 'Pending';
        } else{
            return 'Open';
        }
    }

    function generateStatusClass(status){
        if(status == 1){
            return 'success';
        } else if(status == 2){
            return 'warning';
        } else{
            return 'danger';
        }
    }

    function printData(table)
    {
        var divToPrint=document.getElementById(table);
        newWin= window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    }

    $('.print').click(function(){
        var table = $(this).data('table');
        printData(table);
    })

     $('.notif-read').click(function(e){
       e.preventDefault();
       var notif = $(this).data('notif');
       var link = $(this).attr('href');
       $.post(url+'profil/notifread',{'id_notif' : notif}, function(data){
           window.location = link;
       })
   })

   // audio notifikasi
   var audio = new Audio(base_url+'audio/notif.ogg');
    
    socket.on('new-ticket', function(data){
        var target = $('.ticket-table tbody');
        var targetNotif = $('.table-notif');
        var ticket = data.ticket;
        if(to_user == data.user){
            var name = ticket.user.name;
            var firstName =  name.substring(0, 1);
            var string = '<tr class="danger odd" role="row"><td class="sorting_1"><a href="#"><div class="avatar d-block" title="'+name+'">'+firstName+'</div></a></td><td><a href="http://localhost:3000/ticket/view/'+ticket.ticket_code+'">'+ticket.ticket_code+'</a></td><td>'+ticket.title+'</td><td>'+ticket.description+'</td><td>'+generatePriority(ticket.priority)+'</td><td><span class="status-icon bg-'+generateStatusClass(ticket.status)+' eke"></span>'+generateStatusTicket(ticket.status)+'</td><td><div class="item-action dropdown"><a class="icon" href="javascript:void(0)" data-toggle="dropdown"><i class="fe fe-more-vertical"></i></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item" href="http://localhost:3000/ticket/edit/'+ticket.ticket_code+'"><i class="dropdown-icon fe fe-tag"> Edit</i></a><a class="dropdown-item ticket-delete" href="javascript:void(0)" data-id="'+ticket.id_ticket+'"><i class="dropdown-icon fe fe-edit-2"> Delete</i></a></div></div></td></tr>'
            target.prepend(string);

            var strings = '<tr><td><a href="#"><div class="avatar d-block" title="' +name+ '">' + name.charAt(0) + '</div></a></td><td> <a href="http://localhost:3000/ticket/view/' + ticket.ticket_code + '" style="text-decoration:none; color:#afa5a5; ">New ticket from <span style="color:#5eba00">' + name + '</span></a></td><td class="text-right"><strong>a few seconds ago</strong></td></tr>';

            targetNotif.prepend(strings)
            audio.play()
            notifikasi('info', 'New Ticket From '+name);
            var datass ={
                name: name,
                ticket: ticket.ticket_code,
                type : 'New ticket from'
            }
            notificationMenu(datass)
        }
        
    })

    socket.on('ticket-status', function(data){
       
       if(to_user == data.user){
           var message;
           if(data.status == 2){
               message = 'Ticket has been process By ';
           } else{
               message = 'Pending ticket By '
           }
           var string = '<tr style="background-color:#c1bbbb73"><td><a href="#"><div class="avatar d-block" title="'+data.name+'">'+data.name.charAt(0)+'</div></a></td><td> <a href="http://localhost:3000/ticket/view/'+data.ticket+'" style="text-decoration:none; color:#afa5a5; ">'+message+' <span style="color:#5eba00">'+data.name+'</span></a></td><td class="text-right"><strong>a few seconds ago</strong></td></tr>';
           var target = $('.table-notif');
           target.prepend(string);
           audio.play()
           notifikasi('info', message+' '+data.name);
           notificationMenu(data)

       }
   })

   function notificationMenu(params) {
        var string = `<a class="dropdown-item d-flex notif-read" href="http://localhost:3000/ticket/view/${params.ticket}" data-notif="20"><div class="avatar d-block" title="Admin" style="margin-right:5px;">${params.name.charAt(0)}</div><div><strong>${params.type}<span style="color:#5eba00">&nbsp;${params.name}</span></strong><div class="small text-muted">Beberapa detik yang lalu</div></div></a>`;
       $('.notif-menu').prepend(string);
        return
   }

    // socket.on('count-user', function(data){
    //     console.log(data.online)
    //     $('.user-online').text(data.online);
    // })
    socket.on('new-user', function(data){
        var online = data.online ;
        alert(online)
        $('.user-online').text(online);
        var target = $('.list-separated');
        var text = '<li class="list-separated-item"><div class="row align-items-center"><div class="col-auto"><span class="avatar avatar-md d-block" style="background-image: url(demo/faces/female/12.jpg)"></span></div><div class="col"><div></div><a class="text-inherit" href="javascript:void(0)">'+data.user+' online Now</a><small class="d-block item-except text-sm text-muted h-1x">amanda_hunt@example.com</small></div></div></li>';
        target.prepend(text);
    })

    socket.on('complete-ticket', function(data){
        var message = "tickets have been completed by";
        var string = '<tr style="background-color:#c1bbbb73"><td><a href="#"><div class="avatar d-block" title="'+data.name+'">'+data.name.charAt(0)+'</div></a></td><td> <a href="http://localhost:3000/ticket/view/'+data.ticket+'" style="text-decoration:none; color:#afa5a5; ">'+message+' <span style="color:#5eba00">'+data.name+'</span></a></td><td class="text-right"><strong>a few seconds ago</strong></td></tr>';
        var target = $('.table-notif');
        audio.play()
        if(to_user == data.user){
            target.prepend(string);
            notifikasi('info', message+' '+data.name);
            // append notif to menu notif
            notificationMenu(data)

        }
    })

    socket.on('new-comment', function(data){
       
        var string = '<div class="card" style="box-shadow:none; border:none; background-color:#b5b3b917; border-radius:5px;"><div class="card-body"><div class="d-flex align-items-center mt-auto c-first-child"><div class="avatar avatar-md mr-3" style="background-image: url(./demo/faces/male/16.jpg)">'+data.user.email.charAt(0)+'</div><div><a class="text-default" href="./profile.html">'+data.user.email+'</a><small class="d-block text-muted">Beberapa detik yang lalu</small></div><div class="ml-auto text-muted"></div></div><div class="text-muted c-first-child" style="width:90%; margin-left:3rem; margin-top:0.5rem"><p>'+data.comment+'</p></div><div class="field-edit-comment c-hidden"><form class="form-edit comment" method="post" action="hello"><div class="form-group"><textarea class="form-control" name="comment" ,="" rows="5">'+data.comment+'</textarea></div><div class="form-group text-right"><button class="btn btn-warning edit-cancel" type="button" style="margin-right: 5px;">Cancel</button><button class="btn btn-primary" type="submit">Update</button></div></form></div></div></div>'
        var firstchild = $('.comment-list .card').first();
        if(to_user != data.author){
            audio.play()
            notifikasi('info', 'New Comment from '+data.user.email);
            notificationMenu(data)

            if(firstchild.hasClass('card')){
                $(string).insertBefore(firstchild).hide().fadeIn('slow')
            }
            else{
                return $('.comment-list').append(string).fadeIn('slow');
            }
        }

    })
    
})