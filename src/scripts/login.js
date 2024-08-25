function onChangeEmail() {
  toggleButtonsDisable();
  toggleEmailErrors();
}
function onChangePassword() {
  toggleButtonsDisable();
  togglePasswordErrors();
}

function login() {
  // showLoading();
  firebase
    .auth()
    .signInWithEmailAndPassword(form.email().value, form.password().value)
    .then((res) => {
      // hideLoading();
      window.location.href = "../tela_inicial";
    })
    .catch((error) => {
      // hideLoading();
      alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
  if (error.code == "auth/user-not-found") {
    return "Usuário não encontrado";
  } else if (error.code == "auth/invalid-credential") {
    return "Email ou senha incorretos";
  } else {
    return error.message;
  }
}

function register() {
  window.location.href = "/pages/register";
}

function recoverPassword() {
  // showLoading();
  firebase
    .auth()
    .sendPasswordResetEmail(form.email().value)
    .then(() => {
      // hideLoading();
      alert("Email de recuperação de senha enviado com sucesso");
    })
    .catch((error) => {
      // hideLoading();
      alert(getErrorMessage(error));
    });
}

function toggleEmailErrors() {
  const email = form.email().value;
  form.emailRequiredError().style.display = email ? "none" : "block";
  form.emailInvalidError().style.display = validateEmail(email)
    ? "none"
    : "block";
}

function togglePasswordErrors() {
  const password = form.password().value;
  document.getElementById("password-required-error").style.display = password
    ? "none"
    : "block";
}

function toggleButtonsDisable() {
  const emailValid = isEmailValid();
  form.recoverPassword().disabled = !emailValid;

  const passwordValid = isPasswordValid();
  form.loginButton().disabled = !emailValid || !passwordValid;
}

function isPasswordValid() {
  const password = form.password().value;
  if (!password) {
    return false;
  }
  return true;
}

function isEmailValid() {
  const email = form.email().value;
  if (!email) {
    return false;
  }
  return validateEmail(email);
}

const form = {
  email: () => document.getElementById("email"),
  emailInvalidError: () => document.getElementById("email-invalid-error"),
  emailRequiredError: () => document.getElementById("email-required-error"),
  loginButton: () => document.getElementById("login-button"),
  password: () => document.getElementById("password"),
  recoverPassword: () => document.getElementById("recover-password-button"),
};
