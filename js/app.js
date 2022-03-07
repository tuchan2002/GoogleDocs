window.onload = function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const ADD_DOCS = "add";
    const EDIT_DOCS = "edit";

    const app = (function () {
        const sectionHeader = $(".header");
        const sectionCreate = $(".create");
        const documentContainerTop = $(".document-container-top");
        const documentMain = $(".document-main");
        const addBtn = $(".add-btn");
        const editLogo = $(".edit-logo");
        const editSection = $(".edit");
        const createItemBlank = $(".create-item-image");
        const documentList = $(".document-list");
        const saveBtn = $(".edit-save");
        const titleInput = $(".edit-title");
        const popupRename = $(".popup-rename");
        const popupCancel = $$(".popup-cancel");
        const popupConfirm = $$(".popup-confirm");
        const popupInput = $(".popup-input");
        const popupSave = $(".popup-save");
        const popupNo = $(".popup-no");

        const sectionCreateHeight = sectionCreate.offsetHeight;
        const documentContainerTopHeight = documentContainerTop.offsetHeight;

        let action = ADD_DOCS;
        let editIndex = 0;
        let updateTitleIndex = 0;

        return {
            insertDocument(title, desc, time) {
                let getLocalStorage = localStorage.getItem("Docs");
                if (getLocalStorage == null) {
                    listDocs = [];
                } else {
                    listDocs = JSON.parse(getLocalStorage);
                }
                listDocs.push({ title, desc, time });
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            removeDocument(index) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                listDocs.splice(index, 1);
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            editDocument(index, title, desc) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                listDocs[index].title = title;
                listDocs[index].desc = desc;
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            updateTitle(index, title) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                listDocs[index].title = title;
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            isDataChange(index) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                let title = listDocs[index].title;
                let desc = listDocs[index].desc;
                let currentTitle = titleInput.value;
                let currentDesc = tinyMCE.get("content").getContent();
                if (!(title === currentTitle && desc === currentDesc)) {
                    return true;
                }
                return false;
            },
            isData() {
                let currentTitle = titleInput.value;
                let currentDesc = tinyMCE.get("content").getContent();
                if (!(currentTitle === "" && currentDesc === "")) {
                    return true;
                }
                return false;
            },
            clearInputValue() {
                titleInput.value = "";
                tinyMCE.get("content").setContent("");
            },
            handleEvents() {
                // window scroll
                const handleScroll = () => {
                    if (window.scrollY >= sectionCreateHeight) {
                        addBtn.classList.add("active");
                        documentContainerTop.classList.add("active");
                        documentMain.style = `margin-top: ${documentContainerTopHeight}px`;
                    } else {
                        addBtn.classList.remove("active");
                        documentContainerTop.classList.remove("active");
                        documentMain.style = `margin: 0`;
                    }
                };
                window.addEventListener("scroll", handleScroll);

                // handle open/close editSection (ADD)
                const handleOpenEditSection = () => {
                    editSection.classList.add("active");
                    const body = document.body;
                    body.style.height = "100vh";
                    body.style.overflowY = "hidden";
                };
                const handleCloseEditSection = () => {
                    editSection.classList.remove("active");
                    const body = document.body;
                    body.style.height = "";
                    body.style.overflowY = "";
                };
                editLogo.onclick = () => {
                    if (action === EDIT_DOCS && this.isDataChange(editIndex)) {
                        popupSave.classList.add("open-popup");
                    } else if (action === ADD_DOCS && this.isData()) {
                        popupSave.classList.add("open-popup");
                    } else {
                        handleCloseEditSection();
                        this.clearInputValue();
                    }
                };
                createItemBlank.onclick = () => {
                    handleOpenEditSection();
                    action = ADD_DOCS;
                };
                addBtn.onclick = () => {
                    handleOpenEditSection();
                    action = ADD_DOCS;
                };
                const openEditDocument = (index) => {
                    titleInput.value = listDocs[index].title;
                    tinyMCE.get("content").setContent(listDocs[index].desc);
                    handleOpenEditSection();
                };

                // handle insert docs
                saveBtn.onclick = () => {
                    let title =
                        titleInput.value.trim() === ""
                            ? "Untitled document"
                            : titleInput.value.trim();
                    let desc = tinyMCE.get("content").getContent().trim();
                    let time = "Opened Mar 1, 2022";

                    if (action === ADD_DOCS) {
                        this.insertDocument(title, desc, time);
                    } else if (action === EDIT_DOCS) {
                        this.editDocument(editIndex, title, desc);
                    }

                    popupSave.classList.remove("open-popup");
                    handleCloseEditSection();
                    this.clearInputValue();
                    this.render();
                };

                // handle click on document list
                documentList.onclick = (e) => {
                    // handle remove docs
                    const removeItem = e.target.closest(
                        ".document-item-remove"
                    );
                    if (removeItem) {
                        let index = removeItem.getAttribute("data-index");
                        this.removeDocument(index);
                        this.render();
                    }

                    // handle rename
                    const renameItem = e.target.closest(
                        ".document-item-rename"
                    );
                    if (renameItem) {
                        // open popup rename
                        popupRename.classList.add("open-popup");
                        popupInput.value = renameItem
                            .closest(".document-item")
                            .querySelector(".document-item-title").textContent;
                        updateTitleIndex =
                            renameItem.getAttribute("data-index");
                    }

                    // open document item
                    const documentItem = e.target.closest(".document-item");
                    if (
                        documentItem &&
                        !e.target.closest(".document-dropdown")
                    ) {
                        editIndex = documentItem.getAttribute("data-index");
                        openEditDocument(editIndex);
                        action = EDIT_DOCS;
                    }

                    // handle click open in new tab
                    const openInNewTabItem = e.target.closest(
                        ".document-item-open"
                    );
                    if (openInNewTabItem) {
                        editIndex = openInNewTabItem.getAttribute("data-index");
                        openEditDocument(editIndex);
                        action = EDIT_DOCS;
                    }
                };

                // close popup
                popupCancel[0].onclick = () => {
                    popupRename.classList.remove("open-popup");
                };
                popupCancel[1].onclick = () => {
                    popupSave.classList.remove("open-popup");
                };

                popupConfirm[0].onclick = () => {
                    if (popupInput.value.trim() !== "") {
                        popupRename.classList.remove("open-popup");
                        this.updateTitle(
                            updateTitleIndex,
                            popupInput.value.trim()
                        );
                        this.render();
                    } else {
                        popupInput.focus();
                    }
                };
                popupConfirm[1].onclick = () => {
                    saveBtn.click();
                };
                popupNo.onclick = () => {
                    popupSave.classList.remove("open-popup");
                    handleCloseEditSection();
                    this.clearInputValue();
                };
            },
            render() {
                let getLocalStorage = localStorage.getItem("Docs");
                if (getLocalStorage == null) {
                    listDocs = [];
                } else {
                    listDocs = JSON.parse(getLocalStorage);
                }
                const htmls = listDocs.map(
                    (docs, index) =>
                        `
                        <li class="document-item" data-index="${index}">
                            <div class="document-item-preview">
                                <p>${docs.desc}</p>
                            </div>
                            <div class="document-item-info">
                                <p class="document-item-title">${docs.title}</p>
                                <div class="document-item-bottom">
                                    <div class="document-item-icon"><img src="./images/docs_icon.png" alt="" /></div>
                                    <p class="document-item-time">${docs.time}</p>
                                    <div class="document-dropdown"><span class="document-item-more"><i class="ti-more"></i></span>
                                        <ul class="document-dropdown-list">
                                            <li class="document-dropdown-item document-item-rename" data-index="${index}"><i class="ti-smallcap"></i><span>Rename</span></li>
                                            <li class="document-dropdown-item document-item-remove" data-index="${index}"><i class="ti-trash"></i><span>Remove</span></li>
                                            <li class="document-dropdown-item document-item-open" data-index="${index}"><i class="ti-new-window"></i><span>Open in new tab</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        `
                );
                documentList.innerHTML = htmls.join("");
            },
            init() {
                this.render();
                this.handleEvents();
            },
        };
    })();
    app.init();
};
