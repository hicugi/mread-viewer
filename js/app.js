const chaptersElm = document.querySelector("#chapters");
const imagesElm = document.querySelector("#images");
const alertElm = document.querySelector("#alert");

const chapters = {};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const selectChapter = async (chapterKey) => {
  const dirHandle = chapters[chapterKey];
  const images = {};

  for await (const [key, value] of dirHandle.entries()) {
    if (value.kind === "file" && key.match(/.*\.(jpg|jpeg|png|gif)$/i)) {
      images[key] = value;
    }
  }

  imagesElm.innerText = "";

  const format = (s) => Number(s.substring(0, s.indexOf(".")));

  Promise.allSettled(
    Object.keys(images)
      .sort((a, b) => format(a) - format(b))
      .map(async (key) => {
        const value = images[key];
        const img = document.createElement("img");

        img.src = URL.createObjectURL(await value.getFile());

        imagesElm.appendChild(img);
      })
  ).then(scrollToTop);
};

document.querySelector("#btnSelectDir").addEventListener("click", async () => {
  alertElm.innerText = "";

  try {
    const options = { mode: "read" };
    const dirHandle = await window.showDirectoryPicker(options);

    for await (const [key, value] of dirHandle.entries()) {
      if (value.kind !== "directory") continue;
      chapters[key] = value;
    }
  } catch (err) {
    document.querySelector("#alert").innerText = err.message;
  }

  chaptersElm.innerHTML = "<option selected disabled>Select a chapter</option>";

  const format = (s) => Number(s.replace("-", "."));
  Object.keys(chapters)
    .sort((a, b) => format(a) - format(b))
    .forEach((key) => {
      const value = chapters[key];
      const option = document.createElement("option");

      option.value = key;
      option.innerText = value.name;

      chaptersElm.appendChild(option);
    });
});

chaptersElm.addEventListener("change", (e) => {
  selectChapter(e.target.value);
});

document.querySelector("#scrollToTop").addEventListener("click", () => {
  scrollToTop();
});

const getSelectedOptionIndex = () => chaptersElm.options.selectedIndex;
document.querySelector("#navPrev").addEventListener("click", () => {
  const index = getSelectedOptionIndex();
  const prevChapter = chaptersElm.options[index - 1];

  if (!chapters[prevChapter.value]) return;

  chaptersElm.value = prevChapter.value;
  selectChapter(prevChapter.value);
});
document.querySelector("#navNext").addEventListener("click", () => {
  const index = getSelectedOptionIndex();
  const nextChapter = chaptersElm.options[index + 1];

  if (!chapters[nextChapter.value]) return;

  chaptersElm.value = nextChapter.value;
  selectChapter(nextChapter.value);
});
