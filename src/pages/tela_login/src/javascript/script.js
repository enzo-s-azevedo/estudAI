function logar(){
    event.preventDefault();
    var login = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    if(login == "admin@admin" && senha == "admin"){
        location.href = "../admin/admin.html";
    }else{
        location.href = "../tela_inicial/index.html";
    }

}
