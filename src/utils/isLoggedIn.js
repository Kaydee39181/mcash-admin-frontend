export const isLoggedIn = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const exp = data.expires_in;
  console.log('data', data)
  if (data) {
    // console.log("hi");
    // console.log(exp < Date.now() / 1000);
    // if (exp < Date.now() / 1000) {
    //   localStorage.clear();
    //   window.location.replace("/");
      // return;
    // }

    return true;
  }else{
    return false;

  }
};
