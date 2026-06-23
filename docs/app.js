document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const leftSidebar = document.querySelector(".left-sidebar");
  const contentWrapper = document.querySelector(".content-wrapper");
  const sidebarNav = document.getElementById("sidebar-nav");
  const contentArea = document.getElementById("content-area");
  const tocList = document.getElementById("toc-list");
  const themeToggle = document.getElementById("theme-toggle");
  const searchInput = document.getElementById("search-input");
  
  // Editor selectors
  const editModeBtn = document.getElementById("edit-mode-btn");
  const editorContainer = document.getElementById("editor-container");
  const editCategory = document.getElementById("edit-category");
  const editTitle = document.getElementById("edit-title");
  const editContent = document.getElementById("edit-content");
  const btnSave = document.getElementById("btn-save");
  const btnCancel = document.getElementById("btn-cancel");

  // WP Style Tabs selectors
  const wpTabVisual = document.getElementById("wp-tab-visual");
  const wpTabCode = document.getElementById("wp-tab-code");

  let currentTheme = localStorage.getItem("theme") || "light";
  let isEditMode = false;
  let currentPageKey = "overview";
  let editorInstance = null; // Store CKEditor instance

  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon();

  // Custom upload adapter class for CKEditor 5
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file
        .then(file => new Promise((resolve, reject) => {
          const data = new FormData();
          data.append('upload', file);

          fetch('/api/upload-image', {
            method: 'POST',
            body: data
          })
          .then(response => response.json())
          .then(result => {
            if (result.success && result.url) {
              resolve({
                default: result.url
              });
            } else {
              reject(result.error || 'Upload failed');
            }
          })
          .catch(err => reject(err));
        }));
    }

    abort() {
      // Abort upload if needed
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  // HTML Formatter function
  function formatHTML(html) {
    let formatted = '';
    let pad = 0;
    const padStr = '  ';
    html = html.replace(/\s*</g, '<').replace(/>\s*/g, '>');
    const tags = html.match(/(<[^>]+>)|([^<]+)/g) || [];
    for (let i = 0; i < tags.length; i++) {
      let node = tags[i].trim();
      if (!node) continue;
      if (node.match(/^<\//)) {
        pad -= 1;
        formatted += padStr.repeat(Math.max(0, pad)) + node + '\n';
      } else if (node.match(/^<[^\/]/) && !node.match(/\/>$/) && !node.match(/^<(br|hr|img|input|meta|link)/i)) {
        formatted += padStr.repeat(Math.max(0, pad)) + node + '\n';
        pad += 1;
      } else {
        formatted += padStr.repeat(Math.max(0, pad)) + node + '\n';
      }
    }
    return formatted.trim();
  }

  // Initialize CKEditor 5 using DecoupledEditor
  let EditorLib = null;
  if (typeof DecoupledEditor !== 'undefined') {
    EditorLib = DecoupledEditor;
    console.log('Using window.DecoupledEditor');
  } else if (typeof CKEditor5 !== 'undefined' && CKEditor5.editorDecoupled && CKEditor5.editorDecoupled.DecoupledEditor) {
    EditorLib = CKEditor5.editorDecoupled.DecoupledEditor;
    console.log('Using CKEditor5.editorDecoupled.DecoupledEditor');
  } else if (typeof ClassicEditor !== 'undefined') {
    EditorLib = ClassicEditor; // Fallback
  }

  if (EditorLib) {
    EditorLib
      .create(document.querySelector('#visual-editor-container'), {
        toolbar: {
          items: [
            'heading', '|',
            'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'alignment', '|',
            'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
            'insertTable', 'mediaEmbed', 'undo', 'redo'
          ]
        },
        extraPlugins: [ MyCustomUploadAdapterPlugin ],
        language: 'vi'
      })
      .then(editor => {
        editorInstance = editor;
        console.log('CKEditor 5 initialized successfully');
        
        // Append the toolbar manually for DecoupledEditor
        const toolbarContainer = document.querySelector('#toolbar-container');
        if (toolbarContainer && editor.ui.view.toolbar) {
          toolbarContainer.innerHTML = ''; // clear previous
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        }
      })
      .catch(error => {
        console.error('Error initializing CKEditor 5:', error);
        alert('Lỗi khởi tạo CKEditor 5: ' + error.message + '\n' + error.stack);
      });
  } else {
    console.warn('Không tìm thấy thư viện CKEditor 5 (DecoupledEditor).');
  }

  // 1. Group Data by Category and Render Sidebar
  let categories = {};
  function rebuildCategories() {
    categories = {};
    Object.keys(docData).forEach(key => {
      const item = docData[key];
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push({ key, ...item });
    });
  }

  function renderSidebar() {
    rebuildCategories();
    sidebarNav.innerHTML = "";
    Object.keys(categories).forEach(cat => {
      const section = document.createElement("div");
      section.className = "nav-category";
      
      const title = document.createElement("div");
      title.className = "nav-category-title";
      title.textContent = cat;
      
      // Toggle collapse on click
      title.addEventListener("click", () => {
        section.classList.toggle("collapsed");
      });
      section.appendChild(title);
      
      const listWrapper = document.createElement("div");
      listWrapper.className = "nav-list-wrapper";

      const ul = document.createElement("ul");
      ul.className = "nav-list";
      
      categories[cat].forEach(page => {
        const li = document.createElement("li");
        li.className = "nav-item";
        li.dataset.key = page.key;
        
        const a = document.createElement("a");
        a.href = `#${page.key}`;
        a.textContent = page.title;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          if (isEditMode) {
            if (!confirm("Bạn đang ở chế độ biên tập. Rời đi sẽ mất các thay đổi chưa lưu?")) {
              return;
            }
            toggleEditMode(false);
          }
          loadPage(page.key);
        });
        
        li.appendChild(a);
        ul.appendChild(li);
      });
      
      listWrapper.appendChild(ul);
      section.appendChild(listWrapper);
      sidebarNav.appendChild(section);
    });
  }

  // 2. Load Article and Generate TOC
  function loadPage(key) {
    if (!docData[key]) return;
    currentPageKey = key;
    
    // Update active state in sidebar
    document.querySelectorAll(".nav-category").forEach(cat => cat.classList.remove("has-active-child"));
    
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.dataset.key === key) {
        item.classList.add("active");
        const category = item.closest(".nav-category");
        if (category) category.classList.add("has-active-child");
      } else {
        item.classList.remove("active");
      }
    });

    const page = docData[key];
    window.location.hash = key;
    
    // Render content
    contentArea.innerHTML = `
      <div class="category-indicator">${page.category}</div>
      <h1>${page.title}</h1>
      <div class="markdown-body">
        ${page.content}
      </div>
    `;

    // Reset scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Generate Table of Contents (TOC)
    generateTOC();
  }

  // 3. Dynamic Table of Contents (TOC) generator
  function generateTOC() {
    tocList.innerHTML = "";
    const headings = contentArea.querySelectorAll("h2, h3");
    
    if (headings.length === 0) {
      const li = document.createElement("li");
      li.className = "toc-item";
      li.textContent = "Không có mục lục phụ";
      li.style.color = "var(--text-secondary)";
      li.style.fontSize = "0.85rem";
      tocList.appendChild(li);
      return;
    }

    headings.forEach((heading, idx) => {
      const headingId = `heading-${idx}`;
      heading.id = headingId;

      const li = document.createElement("li");
      li.className = "toc-item";
      if (heading.tagName === "H3") {
        li.style.paddingLeft = "12px";
      }

      const a = document.createElement("a");
      a.href = `#${headingId}`;
      a.textContent = heading.textContent.replace(/^[0-9.]+\s*/, "");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  // 4. Editor Mode Event Listeners
  editModeBtn.addEventListener("click", () => {
    toggleEditMode(!isEditMode);
  });

  btnCancel.addEventListener("click", () => {
    toggleEditMode(false);
  });

  wpTabVisual.addEventListener("click", () => {
    if (wpTabVisual.classList.contains("active")) return;
    wpTabVisual.classList.add("active");
    wpTabCode.classList.remove("active");

    const codeContent = editContent.value;
    if (editorInstance) {
      editorInstance.setData(codeContent);
      // Show CKEditor container
      const visualContainer = document.querySelector('#visual-editor-container');
      if (visualContainer) visualContainer.style.display = "block";
      const toolbarContainer = document.querySelector('#toolbar-container');
      if (toolbarContainer) toolbarContainer.style.display = "block";
    }
    editContent.style.display = "none";
  });

  wpTabCode.addEventListener("click", () => {
    if (wpTabCode.classList.contains("active")) return;
    wpTabCode.classList.add("active");
    wpTabVisual.classList.remove("active");

    if (editorInstance) {
      let visualContent = editorInstance.getData();
      // Format HTML for easy reading
      visualContent = formatHTML(visualContent);
      editContent.value = visualContent;
      // Hide CKEditor container
      const visualContainer = document.querySelector('#visual-editor-container');
      if (visualContainer) visualContainer.style.display = "none";
      const toolbarContainer = document.querySelector('#toolbar-container');
      if (toolbarContainer) toolbarContainer.style.display = "none";
    }
    editContent.style.display = "block";
  });

  function toggleEditMode(enable) {
    isEditMode = enable;
    if (isEditMode) {
      editModeBtn.classList.add("active");
      contentArea.style.display = "none";
      editorContainer.style.display = "block";
      
      // Populate fields
      const page = docData[currentPageKey];
      editCategory.value = page.category;
      editTitle.value = page.title;
      
      // Populate content
      let initialContent = page.content.trim();
      // Convert <div class="img-caption"> to <figcaption> so CKEditor native caption engine preserves it
      initialContent = initialContent.replace(/<div class="img-caption">([\s\S]*?)<\/div>/g, '<figcaption>$1</figcaption>');

      if (editorInstance) {
        // Reset active tabs to Visual (Trực quan)
        wpTabVisual.classList.add("active");
        wpTabCode.classList.remove("active");
        wpTabVisual.style.display = "inline-block";
        editContent.style.display = "none";
        
        const visualContainer = document.querySelector('#visual-editor-container');
        if (visualContainer) visualContainer.style.display = "block";
        const toolbarContainer = document.querySelector('#toolbar-container');
        if (toolbarContainer) toolbarContainer.style.display = "block";
        editorInstance.setData(initialContent);
      } else {
        // Fallback: If CKEditor failed to load, force Code (Mã) mode
        wpTabCode.classList.add("active");
        wpTabVisual.classList.remove("active");
        wpTabVisual.style.display = "none"; // Hide Visual tab since it's unavailable
        editContent.style.display = "block";
        editContent.value = initialContent;
      }
    } else {
      editModeBtn.classList.remove("active");
      contentArea.style.display = "block";
      editorContainer.style.display = "none";
    }
  }

  // Save via API POST
  btnSave.addEventListener("click", async () => {
    const title = editTitle.value.trim();
    const category = editCategory.value.trim();
    
    // Get content: if currently on Code tab, fetch from textarea, otherwise get from CKEditor
    const content = wpTabCode.classList.contains("active") 
      ? editContent.value 
      : (editorInstance ? editorInstance.getData() : editContent.value);

    if (!title || !category || !content) {
      alert("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    const payload = {
      key: currentPageKey,
      title,
      category,
      content
    };

    try {
      btnSave.disabled = true;
      btnSave.textContent = "⌛ Đang lưu...";
      
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && result.success) {
        // Update local memory data
        docData[currentPageKey] = { title, category, content };
        alert("Lưu thành công và đồng bộ dữ liệu vào file data.js!");
        toggleEditMode(false);
        renderSidebar();
        loadPage(currentPageKey);
      } else {
        alert(`Lỗi khi lưu dữ liệu: ${result.error || "Không rõ nguyên nhân"}`);
      }
    } catch (err) {
      alert(`Không thể kết nối tới Server. Hãy đảm bảo bạn đã khởi chạy server bằng lệnh 'node server.js'! Chi tiết: ${err.message}`);
    } finally {
      btnSave.disabled = false;
      btnSave.textContent = "💾 Lưu và Đồng bộ";
    }
  });

  // 5. Dark/Light Theme Handler
  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    themeToggle.innerHTML = currentTheme === "light" 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }

  // 6. Documentation search utility
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      const key = window.location.hash.substring(1) || "overview";
      loadPage(key);
      return;
    }

    const results = [];
    Object.keys(docData).forEach(key => {
      const page = docData[key];
      const titleMatch = page.title.toLowerCase().includes(query);
      const contentMatch = page.content.toLowerCase().includes(query);
      if (titleMatch || contentMatch) {
        results.push({ key, ...page });
      }
    });

    renderSearchResults(results, query);
  });

  function renderSearchResults(results, query) {
    tocList.innerHTML = "";
    contentArea.innerHTML = `
      <div class="category-indicator">Tìm kiếm</div>
      <h1>Kết quả tìm kiếm cho: "${query}"</h1>
      <div class="search-results-list" style="margin-top: 24px;">
        ${results.length === 0 
          ? `<p style="color: var(--text-secondary); font-style: italic;">Không tìm thấy bài viết nào chứa từ khóa của bạn.</p>`
          : results.map(item => `
              <div class="search-result-item" style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px; background-color: var(--bg-secondary);">
                <h3 style="margin-top: 0;"><a href="#${item.key}" class="result-link" data-key="${item.key}" style="font-size: 1.1rem; color: var(--link-color); font-weight: 600;">${item.title}</a></h3>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Nhóm bài viết: ${item.category}</div>
                <p style="font-size: 0.9rem; margin-bottom: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
                  ${item.content.replace(/<[^>]*>/g, ' ')}
                </p>
              </div>
            `).join("")
        }
      </div>
    `;

    contentArea.querySelectorAll(".result-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        searchInput.value = "";
        loadPage(link.dataset.key);
      });
    });
  }

  // Initialize
  renderSidebar();
  const initialKey = window.location.hash.substring(1) || "overview";
  loadPage(initialKey);

  // Sidebar toggle event listener
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      leftSidebar.classList.toggle("closed");
      contentWrapper.classList.toggle("expanded");
    });
  }

  // Sidebar resizer logic
  const resizer = document.getElementById("sidebar-resizer");
  let isResizing = false;

  const savedSidebarWidth = localStorage.getItem("sidebarWidth");
  if (savedSidebarWidth) {
    document.documentElement.style.setProperty("--sidebar-width", savedSidebarWidth);
  }

  if (resizer) {
    resizer.addEventListener("mousedown", (e) => {
      isResizing = true;
      resizer.classList.add("is-resizing");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 800) newWidth = 800; // Cho phép kéo rộng tối đa 800px
      
      document.documentElement.style.setProperty("--sidebar-width", `${newWidth}px`);
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove("is-resizing");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        
        const currentWidth = document.documentElement.style.getPropertyValue("--sidebar-width");
        if (currentWidth) {
          localStorage.setItem("sidebarWidth", currentWidth);
        }
      }
    });
  }
});
