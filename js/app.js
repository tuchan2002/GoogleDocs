window.onload = function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const ADD_DOCS = "add";
    const EDIT_DOCS = "edit";

    const CREATE_TIME_SORT = "create-time-sort";
    const OPEN_TIME_SORT = "open-time-sort";
    const EDIT_TIME_SORT = "edit-time-sort";
    const TITLE_SORT = "title-sort";

    const app = (function () {
        const wrapper = $(".wrapper");
        const sectionHeader = $(".header");
        const headerMenu = $(".header-menu");
        const menuToggle = $(".header-toggle");
        const editRight = $(".edit-right");
        const editToggle = $(".edit-toggle");
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
        const documentSetting = $(".document-setting");
        const documentSettingItems = $$(".dropdown-item");
        const editTime = $(".edit-time");
        const documentEmptyNotice = $(".document-empty-notice");
        const popupRemove = $(".popup-remove");
        const popupDetailClose = $(".popup-detail-close");
        const popupDetail = $(".popup-detail");
        const editActionDetail = $(".edit-action-detail");
        const popupDetailEditTime = $(".popup-detail-edit-time");
        const popupDetailCreateTime = $(".popup-detail-create-time");
        const hiddenDownloadBtn = $("#hidden-download-btn");

        const sectionCreateHeight = sectionCreate.offsetHeight;
        const documentContainerTopHeight = documentContainerTop.offsetHeight;

        let action = ADD_DOCS;
        let editIndex = 0;
        let updateTitleIndex = 0;
        let removeIndex = 0;
        let statusSort = CREATE_TIME_SORT;

        return {
            insertDocument(title, desc, openTime, editTime, createTime) {
                let getLocalStorage = localStorage.getItem("Docs");
                if (getLocalStorage == null) {
                    listDocs = [];
                } else {
                    listDocs = JSON.parse(getLocalStorage);
                }
                listDocs.push({ title, desc, openTime, editTime, createTime });
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            removeDocument(index) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                listDocs.splice(index, 1);
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            editDocument(index, title, desc, editTime) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                listDocs[index].title = title;
                listDocs[index].desc = desc;
                listDocs[index].editTime = editTime;
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            updateTitle(index, title, editTime) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                listDocs[index].title = title;
                listDocs[index].editTime = editTime;
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
            formatTime(time) {
                if (moment() - time <= 86400000) {
                    return time.format("LT");
                } else {
                    return time.format("ll");
                }
            },
            downloadDocument(filename, content) {
                hiddenDownloadBtn.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," +
                        encodeURIComponent(content)
                );
                hiddenDownloadBtn.setAttribute("download", filename);
                hiddenDownloadBtn.click();
            },
            handleDownloadDocument(index) {
                let getLocalStorage = localStorage.getItem("Docs");
                listDocs = JSON.parse(getLocalStorage);
                let filename = listDocs[index].title + ".html";
                let content = listDocs[index].desc;
                this.downloadDocument(filename, content);
            },
            handleSortDocuments() {
                if (statusSort === CREATE_TIME_SORT) {
                    this.sortDocuments(this.compareByCreateTime);
                } else if (statusSort === EDIT_TIME_SORT) {
                    this.sortDocuments(this.compareByEditTime);
                } else if (statusSort === OPEN_TIME_SORT) {
                    this.sortDocuments(this.compareByOpenTime);
                } else if (statusSort === TITLE_SORT) {
                    this.sortDocuments(this.compareByTitle);
                }
            },
            sortDocuments(compareFunction) {
                let getLocalStorage = localStorage.getItem("Docs");
                if (getLocalStorage == null) {
                    listDocs = [];
                } else {
                    listDocs = JSON.parse(getLocalStorage);
                }
                listDocs.sort(compareFunction);
                localStorage.setItem("Docs", JSON.stringify(listDocs));
            },
            compareByTitle(a, b) {
                return a.title.localeCompare(b.title);
            },
            compareByEditTime(a, b) {
                let res = moment(a.editTime).isBefore(moment(b.editTime))
                    ? 1
                    : -1;
                return res;
            },
            compareByOpenTime(a, b) {
                let res = moment(a.openTime).isBefore(moment(b.openTime))
                    ? 1
                    : -1;
                return res;
            },
            compareByCreateTime(a, b) {
                let res = moment(a.createTime).isAfter(moment(b.createTime))
                    ? 1
                    : -1;
                return res;
            },
            handleEvents() {
                // header toggle
                menuToggle.onclick = () => {
                    headerMenu.classList.add("active");
                };

                // edit toggle
                editToggle.onclick = () => {
                    editRight.classList.add("active");
                };
                document.onclick = (e) => {
                    if (
                        !editRight.contains(e.target) &&
                        !e.target.closest(".edit-toggle")
                    ) {
                        editRight.classList.remove("active");
                    }
                    if (
                        !headerMenu.contains(e.target) &&
                        !e.target.closest(".header-toggle")
                    ) {
                        headerMenu.classList.remove("active");
                    }
                };

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
                    this.render();
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
                    editActionDetail.classList.add("disabled");
                };
                addBtn.onclick = () => {
                    handleOpenEditSection();
                    action = ADD_DOCS;
                    editActionDetail.classList.add("disabled");
                };
                const openEditDocument = (index) => {
                    let getLocalStorage = localStorage.getItem("Docs");
                    listDocs = JSON.parse(getLocalStorage);
                    titleInput.value = listDocs[index].title;
                    editTime.textContent = `Last edit was ${moment(
                        listDocs[index].editTime
                    ).fromNow()}`;
                    tinyMCE.get("content").setContent(listDocs[index].desc);
                    listDocs[index].openTime = moment();
                    popupDetailEditTime.textContent = `${this.formatTime(
                        moment(listDocs[index].editTime)
                    )} by me`;
                    popupDetailCreateTime.textContent = this.formatTime(
                        moment(listDocs[index].createTime)
                    );
                    localStorage.setItem("Docs", JSON.stringify(listDocs));
                    handleOpenEditSection();
                    editActionDetail.classList.remove("disabled");
                };

                // handle insert docs
                saveBtn.onclick = () => {
                    let title =
                        titleInput.value.trim() === ""
                            ? "Untitled document"
                            : titleInput.value.trim();
                    let desc = tinyMCE.get("content").getContent().trim();
                    let openTime = moment();
                    let editTime = moment();
                    let createTime = moment();

                    if (action === ADD_DOCS) {
                        this.insertDocument(
                            title,
                            desc,
                            openTime,
                            editTime,
                            createTime
                        );
                    } else if (action === EDIT_DOCS) {
                        this.editDocument(editIndex, title, desc, editTime);
                    }

                    popupSave.classList.remove("open-popup");
                    handleCloseEditSection();
                    this.clearInputValue();
                };

                // handle click on document list
                documentList.onclick = (e) => {
                    const documentDropdown =
                        e.target.closest(".document-dropdown");
                    if (documentDropdown) {
                        const documentDropdownTitle =
                            documentDropdown.querySelector(
                                ".document-dropdown-title"
                            );
                        const documentItemTitle = documentDropdown
                            .closest(".document-item-info")
                            .querySelector(".document-item-title");
                        documentDropdownTitle.textContent =
                            documentItemTitle.textContent;
                    }

                    // handle remove docs
                    const removeItem = e.target.closest(
                        ".document-item-remove"
                    );
                    if (removeItem) {
                        // open popup remove
                        let removeIndex = removeItem.getAttribute("data-index");
                        popupRemove.classList.add("open-popup");
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

                    // handle click download
                    const downloadItem = e.target.closest(
                        ".document-item-download"
                    );
                    if (downloadItem) {
                        let downloadIndex =
                            downloadItem.getAttribute("data-index");
                        this.handleDownloadDocument(downloadIndex);
                    }
                };

                // close popup
                popupCancel[0].onclick = () => {
                    popupRename.classList.remove("open-popup");
                };
                popupCancel[1].onclick = () => {
                    popupSave.classList.remove("open-popup");
                };
                popupCancel[2].onclick = () => {
                    popupRemove.classList.remove("open-popup");
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

                popupConfirm[2].onclick = () => {
                    this.removeDocument(removeIndex);
                    popupRemove.classList.remove("open-popup");
                    this.render();
                };

                documentSetting.onclick = (e) => {
                    const titleSort = e.target.closest(".title-sort");
                    if (titleSort) {
                        statusSort = TITLE_SORT;
                        this.render();
                    }

                    const lastOpenSort = e.target.closest(".last-open-sort");
                    if (lastOpenSort) {
                        statusSort = OPEN_TIME_SORT;
                        this.render();
                    }

                    const lastModifiedSort = e.target.closest(
                        ".last-modified-sort"
                    );
                    if (lastModifiedSort) {
                        statusSort = EDIT_TIME_SORT;
                        this.render();
                    }

                    const firstCreateSort =
                        e.target.closest(".first-create-sort");
                    if (firstCreateSort) {
                        statusSort = CREATE_TIME_SORT;
                        this.render();
                    }
                };
                documentSettingItems.forEach((item) => {
                    item.onclick = () => {
                        documentSettingItems.forEach((element) => {
                            element.classList.remove("active");
                        });
                        item.classList.add("active");
                    };
                });

                editActionDetail.onclick = () => {
                    editRight.classList.remove("active");
                    popupDetail.classList.add("open-popup");
                };
                popupDetailClose.onclick = () => {
                    popupDetail.classList.remove("open-popup");
                };
            },
            render() {
                this.handleSortDocuments();
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
                                    <p class="document-item-time">Opened ${this.formatTime(
                                        moment(docs.openTime)
                                    )}</p>
                                    <div class="document-dropdown"><span class="document-item-more"><i class="ti-more"></i></span>
                                        <ul class="document-dropdown-list">
                                            <li class="document-dropdown-top"> 
                                                <img src="./images/docs_icon.png" alt="" />
                                                <p class="document-dropdown-title">React JS Basic</p>
                                            </li>
                                            <li class="document-dropdown-item document-item-rename" data-index="${index}"><i class="ti-smallcap"></i><span class="document-dropdown-item-text">Rename</span></li>
                                            <li class="document-dropdown-item document-item-remove" data-index="${index}"><i class="ti-trash"></i><span class="document-dropdown-item-text">Remove</span></li>
                                            <li class="document-dropdown-item document-item-open" data-index="${index}"><i class="ti-new-window"></i><span class="document-dropdown-item-text">Open in new tab</span></li>
                                            <li class="document-dropdown-item document-item-download" data-index="${index}"><i class="ti-cloud-down"></i><span class="document-dropdown-item-text">Download</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        `
                );
                documentList.innerHTML = htmls.join("");
                if (listDocs.length === 0) {
                    documentEmptyNotice.classList.add("show");
                } else {
                    documentEmptyNotice.classList.remove("show");
                }
            },
            init() {
                this.render();
                this.handleEvents();
            },
        };
    })();
    app.init();
};
