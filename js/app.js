const chaptersElm = document.querySelector("#chapters");
const imagesElm = document.querySelector("#images");

const chapters = {};

document.querySelector("#btnSelectDir").addEventListener("click", async () => {
  const options = { mode: "read" };
  const dirHandle = await window.showDirectoryPicker(options);

  chaptersElm.innerHTML = "";

  for await (const [key, value] of dirHandle.entries()) {
    if (value.kind !== "directory") continue;

    const option = document.createElement("option");
    option.value = key;
    option.innerText = value.name;

    chapters[key] = value;

    chaptersElm.appendChild(option);
  }
});

chaptersElm.addEventListener("change", async (e) => {
  const dirHandle = chapters[e.target.value];

  for await (const [, value] of dirHandle.entries()) {
    if (value.kind !== "file") continue;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(await value.getFile());

    imagesElm.appendChild(img);
  }
});

document.querySelector("#scrollToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
