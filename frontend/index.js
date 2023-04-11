const renderPage = async () => {
  let response = await axios.get("http://localhost:1337/api/posts?populate=*");
  let posts = response.data.data;
  console.log(posts);

  if (sessionStorage.getItem("token")) {
    document.querySelector(".new-post").classList.remove("hidden");
    document.querySelector("#logout").classList.remove("hidden");
    document.querySelector("#login").classList.add("hidden");
  } else {
    document.querySelector(".new-post").classList.add("hidden");
    document.querySelector("#logout").classList.add("hidden");
    document.querySelector("#login").classList.remove("hidden");
  }

  document.querySelector("#posts-container").innerHTML = "";
  let listOfPosts = document.createElement("ul");
  posts.forEach((post) => {
    let { title, content, user } = post.attributes;
    let { username } = user.data.attributes;
    listOfPosts.innerHTML += `
  <li class="blog-post">
    <h3>${title}</h3>
    ${marked.parse(content)}
    <p>Posted by ${username}
  </li>`;
  });
  document.querySelector("#posts-container").append(listOfPosts);
};

const login = async () => {
  let identifier = document.querySelector("#identifier");
  let password = document.querySelector("#password");
  let response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: identifier.value,
    password: password.value,
  });
  console.log(response);
  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("loginId", response.data.user.id);
  renderPage();
};

const createPost = async () => {
  let title = document.querySelector("#title").value;
  let content = document.querySelector("#content").value;
  await axios.post(
    "http://localhost:1337/api/posts",
    {
      data: {
        title,
        content,
        user: sessionStorage.getItem("loginId"),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  renderPage();
};

const logout = async () => {
  sessionStorage.clear();
  renderPage();
};

const applyTheme = async () => {
  let response = await axios.get("http://localhost:1337/api/startpage");
  let theme = response.data.data.attributes.theme;
  console.log(theme);

  document.body.classList.add(theme);
};

document.querySelector("#logout").addEventListener("click", logout);
document.querySelector("#login").addEventListener("click", login);
document.querySelector("#createPost").addEventListener("click", createPost);

applyTheme();
renderPage();
