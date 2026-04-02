function checkToken(token, navigate) {
  // If no token is found, redirects the user to the signup screen.
  if (!token) {
    navigate("/signup");
    return;
  }
}

export default  checkToken