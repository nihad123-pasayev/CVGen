
const signupForm = document.getElementById("signupform");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords are not matched!");
            return;
        }

        const result = await registerUser(fullName, email, password);

        if (result.success) {
            alert("Registeration is successed");
            window.location.href = "login.html";
        } else {
            alert("Error: " + result.message);
        }
    });
}




const loginForm = document.getElementById("loginform");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const result = await loginUser(email, password);

        if (result.success) {
            alert("Login is successed");
            window.location.href = "index.html";
        } else {
            alert("Xəta: " + result.message);
        }
    });
}



const toggles = document.querySelectorAll('.toggle-password');

toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const input = toggle.parentElement.querySelector('.password-field');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        toggle.classList.toggle('ti-eye');
        toggle.classList.toggle('ti-eye-off');
    });
});

const createCvBtn = document.querySelector(".create-btn");

if (createCvBtn) {
    createCvBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = await getCurrentUser();

        if (user) {

            window.location.href = "templates.html";
        } else {

            window.location.href = "login.html";
        }
    });
}

const loginBtn = document.querySelector(".login-btn");

if (loginBtn) {
    (async () => {
        const user = await getCurrentUser();
        if (user) {
            loginBtn.textContent = "Logout"
            loginBtn.href = "#"

            loginBtn.addEventListener("click", async (e) => {
                e.preventDefault();

                const result = await logoutUser();

                if (result.success) {
                    window.location.reload();
                } else {
                    alert("Something went wrong!");
                }
            });
        }
    })();
}




document.addEventListener("DOMContentLoaded", () => {

    const bindings = [

        { inputId: "job", previewId: "out-job", defaultText: "JOB TITLE" },
        { inputId: "phone", previewId: "out-phone", defaultText: "Phone" },
        { inputId: "Location", previewId: "out-location", defaultText: "Address" },
        { inputId: "email", previewId: "out-email", defaultText: "Email" },
        { inputId: "profile-input", previewId: "out-instagram", defaultText: "Profile" },
        { inputId: "about", previewId: "out-about", defaultText: "Enter information about you..." }
    ];
    const fileInput = document.getElementById("fileInput");
    const profilePreview = document.getElementById("profile-preview");
    const outPhoto = document.getElementById("out-photo");

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                if (profilePreview) profilePreview.src = imgData;
                if (outPhoto) outPhoto.src = imgData;
            };
            reader.readAsDataURL(file);
        });
    }

    function getFullName() {
        const nameval = document.getElementById("name").value.trim();
        const surnameval = document.getElementById("surname").value.trim();
        const cv_name = document.getElementById("out-name");
        const fullname = `${nameval}  ${surnameval}`;
        if (fullname.trim() !== "") {
            cv_name.textContent = fullname;
        } else {
            cv_name.textContent = "YOUR NAME";
        }
    }

    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");

    if (nameInput) { nameInput.addEventListener("input", getFullName); }
    if (surnameInput) { surnameInput.addEventListener("input", getFullName); }

    bindings.forEach(item => {
        const inputEl = document.getElementById(item.inputId);
        const cv_el = document.getElementById(item.previewId);

        if (inputEl && cv_el) {
            inputEl.addEventListener("input", (e) => {
                let val = e.target.value.trim();

                if (val !== "") {
                    cv_el.textContent = val;
                    cv_el.classList.remove("cv-placeholder");
                } else {
                    cv_el.textContent = item.defaultText;
                    cv_el.classList.add("cv-placeholder");
                }
            });
        }
    });

    // ---- PROFILES ----
    let profile_add_btn = document.getElementById("profile-add");
    let profile_select = document.getElementById("prf-slct");
    const profilesContainer = document.getElementById("profiles-container");

    if (profile_add_btn && profile_select && profilesContainer) {
        profile_add_btn.addEventListener("click", () => {
            profile_select.style.visibility = "visible";
        });

        profile_select.addEventListener("change", (e) => {
            const selectedval = e.target.value;
            if (!selectedval) return;

            const label = selectedval.charAt(0).toUpperCase() + selectedval.slice(1);

            let profileDiv = document.createElement("div");
            profileDiv.style.cssText = "grid-column: span 2; display:flex; align-items:flex-end; gap:10px;";
            profileDiv.innerHTML = `
                <div style="flex:1;">
                    <label class="infolabel">${label}</label><br>
                    <input class="infoinput" type="text" name="${selectedval}" placeholder="Enter the URL..." style="margin-bottom:0;">
                </div>
                <button class="remove" type="button">-</button>
            `;

            const inputEl = profileDiv.querySelector("input");
            const removeBtn = profileDiv.querySelector(".remove");
            const previewEl = document.getElementById(`out-${selectedval}`);

            inputEl.addEventListener("input", (e) => {
                const val = e.target.value.trim();
                if (!previewEl) return;

                const textSpan = previewEl.querySelector(".cv-profile-text");

                if (val !== "") {
                    if (textSpan) textSpan.textContent = val;
                    previewEl.classList.remove("cv-hidden");
                } else {
                    previewEl.classList.add("cv-hidden");
                }
            });

            removeBtn.addEventListener("click", () => {
                profileDiv.remove();
                if (previewEl) {
                    previewEl.classList.add("cv-hidden");
                }
            });

            profilesContainer.appendChild(profileDiv);

            profile_select.selectedIndex = 0;
            profile_select.style.visibility = "hidden";
        });
    }

});

// ============================================================
// WORK EXPERIENCE
// ============================================================
const work_add_btn = document.getElementById("work-add");
const workscontainer = document.getElementById("workscontanier");
const outExperience = document.getElementById("out-experience");

if (work_add_btn && workscontainer && outExperience) {
    work_add_btn.addEventListener("click", () => {

        let workDiv = document.createElement("div");
        workDiv.className = "dyn-block";
        workDiv.style.cssText = "position:relative; width:100%; box-sizing:border-box; border:1.5px dashed rgb(200,200,230); border-radius:10px; padding:14px; margin-bottom:14px;";
        workDiv.innerHTML = `
            <button class="remove" type="button" style="position:absolute; top:10px; right:10px;">-</button>

            <div class="dyn-fields-grid">
                <div>
                    <label class="infolabel">Company name:</label><br>
                    <input class="infoinput work-comp" type="text" name="company">
                </div>
                <div>
                    <label class="infolabel">Position:</label><br>
                    <input class="infoinput work-position" type="text" name="position">
                </div>
                <div>
                    <label class="infolabel">Start Date:</label><br>
                    <input class="infoinput work-start" type="date" name="stdate">
                </div>
                <div>
                    <label class="infolabel">End Date:</label><br>
                    <input class="infoinput work-end" type="date" name="enddate">
                    <div style="display:flex; align-items:center; margin-top:5px;">
                        <input class="infocheck work-ongoing" type="checkbox" name="ongoing">
                        <label class="infolabel" style="margin-left:3px;">Ongoing</label>
                    </div>
                </div>
            </div>

            <div style="margin-top:10px;">
                <label class="infolabel">The works you have done and success:</label><br>
                <textarea class="infotext-area work-desc" placeholder="Works and success..."></textarea>
            </div>
        `;

        const removeBtn = workDiv.querySelector(".remove");
        const endDateEl = workDiv.querySelector(".work-end");
        const ongoingEl = workDiv.querySelector(".work-ongoing");

        ongoingEl.addEventListener("change", () => {
            if (ongoingEl.checked) {
                endDateEl.value = "";
                endDateEl.disabled = true;
            } else {
                endDateEl.disabled = false;
            }
            updateExperiencePreview();
        });

        workDiv.querySelectorAll("input, textarea").forEach(el => {
            el.addEventListener("input", updateExperiencePreview);
        });

        removeBtn.addEventListener("click", () => {
            workDiv.remove();
            updateExperiencePreview();
        });

        workscontainer.appendChild(workDiv);
    });
}

function updateExperiencePreview() {
    if (!workscontainer || !outExperience) return;

    const blocks = workscontainer.querySelectorAll(".dyn-block");

    if (blocks.length === 0) {
        outExperience.innerHTML = `<p class="cv-placeholder">No experience added yet</p>`;
        return;
    }

    let html = "";

    blocks.forEach(block => {
        const comp = block.querySelector(".work-comp").value.trim();
        const pos = block.querySelector(".work-position").value.trim();
        const start = block.querySelector(".work-start").value;
        const end = block.querySelector(".work-end").value;
        const ongoing = block.querySelector(".work-ongoing").checked;
        const desc = block.querySelector(".work-desc").value.trim();

        if (comp === "" && pos === "") return;

        const dates = (start || end) ? `${start || ""} – ${ongoing ? "Ongoing" : (end || "")}` : "";
        const descHtml = desc
            ? `<p class="cv-exp-subheading">The works I have done and success:</p>
               <ul>${desc.split("\n").filter(line => line.trim() !== "").map(line => `<li>${line}</li>`).join("")}</ul>`
            : "";

        html += `
            <div class="cv-exp-item">
                <div class="cv-exp-top">
                    <span class="cv-exp-role">${pos || "Position"}</span>
                    <span class="cv-exp-dates">${dates}</span>
                </div>
                <div class="cv-exp-company">${comp || "Company"}</div>
                ${descHtml}
            </div>
        `;
    });

    outExperience.innerHTML = html !== "" ? html : `<p class="cv-placeholder">No experience added yet</p>`;
}

// ============================================================
// EDUCATION
// ============================================================
const edu_add_btn = document.getElementById("edu-add");
const educontainer = document.getElementById("educontanier");
const outEducation = document.getElementById("out-education");

if (edu_add_btn && educontainer && outEducation) {
    edu_add_btn.addEventListener("click", () => {

        let eduDiv = document.createElement("div");
        eduDiv.className = "dyn-block";
        eduDiv.style.cssText = "position:relative; width:100%; box-sizing:border-box; border:1.5px dashed rgb(200,200,230); border-radius:10px; padding:14px; margin-bottom:14px;";
        eduDiv.innerHTML = `
            <button class="remove" type="button" style="position:absolute; top:10px; right:10px;">-</button>

            <div class="dyn-fields-grid">
                <div>
                    <label class="infolabel">Name of University:</label><br>
                    <input class="infoinput edu-uni" type="text" name="university">
                </div>
                <div>
                    <label class="infolabel">Major:</label><br>
                    <input class="infoinput edu-major" type="text" name="major">
                </div>
                <div>
                    <label class="infolabel">Start Date:</label><br>
                    <input class="infoinput edu-start" type="date" name="stdate">
                </div>
                <div>
                    <label class="infolabel">End Date:</label><br>
                    <input class="infoinput edu-end" type="date" name="enddate">
                    <div style="display:flex; align-items:center; margin-top:5px;">
                        <input class="infocheck edu-ongoing" type="checkbox" name="ongoing">
                        <label class="infolabel" style="margin-left:3px;">Ongoing</label>
                    </div>
                </div>
            </div>
        `;

        const removeBtn = eduDiv.querySelector(".remove");
        const endDateEl = eduDiv.querySelector(".edu-end");
        const ongoingEl = eduDiv.querySelector(".edu-ongoing");

        ongoingEl.addEventListener("change", () => {
            if (ongoingEl.checked) {
                endDateEl.value = "";
                endDateEl.disabled = true;
            } else {
                endDateEl.disabled = false;
            }
            updateEducationPreview();
        });

        eduDiv.querySelectorAll("input").forEach(el => {
            if (el !== ongoingEl) {
                el.addEventListener("input", updateEducationPreview);
            }
        });

        removeBtn.addEventListener("click", () => {
            eduDiv.remove();
            updateEducationPreview();
        });

        educontainer.appendChild(eduDiv);
    });
}

function updateEducationPreview() {
    if (!educontainer || !outEducation) return;

    const blocks = educontainer.querySelectorAll(".dyn-block");

    if (blocks.length === 0) {
        outEducation.innerHTML = `<p class="cv-placeholder">No education added</p>`;
        return;
    }

    let html = "";

    blocks.forEach(block => {
        const uni = block.querySelector(".edu-uni").value.trim();
        const major = block.querySelector(".edu-major").value.trim();
        const start = block.querySelector(".edu-start").value;
        const end = block.querySelector(".edu-end").value;
        const ongoing = block.querySelector(".edu-ongoing").checked;

        if (uni === "" && major === "") return;

        const dates = (start || end || ongoing) ? `${start || ""} – ${ongoing ? "Present" : (end || "")}` : "";

        html += `
            <div class="cv-exp-item">
                <div class="cv-exp-top">
                    <span class="cv-exp-role">${uni || "University"}</span>
                    <span class="cv-exp-dates">${dates}</span>
                </div>
                <div class="cv-exp-company">${major || "Major"}</div>
            </div>
        `;
    });

    outEducation.innerHTML = html !== "" ? html : `<p class="cv-placeholder">No education added</p>`;
}

// ============================================================
// SKILLS
// ============================================================
const skill_add_btn = document.getElementById("skill-add");
const skillscontainer = document.getElementById("skillscontanier");
const outSkills = document.getElementById("out-skills");

if (skill_add_btn && skillscontainer && outSkills) {
    skill_add_btn.addEventListener("click", () => {

        let skillDiv = document.createElement("div");
        skillDiv.className = "dyn-row";
        skillDiv.style.cssText = "display:flex; align-items:center; gap:10px; margin-bottom:10px;";
        skillDiv.innerHTML = `
            <input class="infoinput skill-item" type="text" name="skill" placeholder="Ex: Programming, Teamwork..." style="margin-bottom:0; flex:1;">
            <button class="remove" type="button">-</button>
        `;

        const inputEl = skillDiv.querySelector(".skill-item");
        const removeBtn = skillDiv.querySelector(".remove");

        inputEl.addEventListener("input", updateSkillsPreview);

        removeBtn.addEventListener("click", () => {
            skillDiv.remove();
            updateSkillsPreview();
        });

        skillscontainer.appendChild(skillDiv);
    });
}

function updateSkillsPreview() {
    if (!skillscontainer || !outSkills) return;

    const inputs = skillscontainer.querySelectorAll(".skill-item");

    let html = "";
    inputs.forEach(inp => {
        const val = inp.value.trim();
        if (val !== "") {
            html += `<li>${val}</li>`;
        }
    });

    outSkills.innerHTML = html !== "" ? html : `<li class="cv-placeholder">No skills added</li>`;
}

// ============================================================
// LANGUAGES
// ============================================================
const lang_btn = document.getElementById("lang-add");
const langcontanier = document.getElementById("languagecontanier");
const outlanguages = document.getElementById("out-languages");

if (lang_btn && langcontanier && outlanguages) {
    lang_btn.addEventListener("click", () => {
        let langdiv = document.createElement("div");
        langdiv.className = "dyn-row";
        langdiv.style.cssText = "display:flex; align-items:center; gap:10px; margin-bottom:10px;";
        langdiv.innerHTML = `
            <input class="infoinput lang-name" type="text" name="language" placeholder="Ex: English..." style="margin-bottom:0;">
            <select class="lang-select" style="margin-bottom:0;">
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
                <option>C1</option>
                <option>C2</option>
            </select>
            <button class="remove" type="button">-</button>
        `;

        const inputel = langdiv.querySelector(".lang-name");
        const selection = langdiv.querySelector(".lang-select");
        const removebtn = langdiv.querySelector(".remove");

        inputel.addEventListener("input", updatelanguage);
        selection.addEventListener("change", updatelanguage);

        removebtn.addEventListener("click", () => {
            langdiv.remove();
            updatelanguage();
        });

        langcontanier.appendChild(langdiv);
    });
}

function updatelanguage() {
    if (!langcontanier || !outlanguages) return;

    const rows = langcontanier.querySelectorAll(".dyn-row");
    let html = "";

    rows.forEach(row => {
        const inp = row.querySelector(".lang-name");
        const sel = row.querySelector(".lang-select");
        const val = inp.value.trim();
        const lvl = sel.value.trim();

        if (val !== "") {
            html += `<li>${val} — ${lvl}</li>`;
        }
    });

    outlanguages.innerHTML = html !== "" ? html : `<li class="cv-placeholder">No languages added</li>`;
}


function setupAddSection(config) {
    const addBtn = document.getElementById(config.addBtnId);
    const container = document.getElementById(config.containerId);
    const outBlock = document.getElementById(config.outBlockId);
    const outList = document.getElementById(config.outListId);

    if (!addBtn || !container || !outBlock || !outList) return;

    addBtn.addEventListener("click", () => {
        let row = document.createElement("div");
        row.className = "dyn-row";
        row.style.cssText = "position:relative; margin-bottom:10px; width:100%; box-sizing:border-box; padding-right:45px;";
        row.innerHTML = `
            <label class="infolabel" style="font-size:16px;">${config.label}</label><br>
            <input class="infoinput row-name" type="text" placeholder="${config.placeholder}" style="margin-bottom:0;">
            <button class="remove" type="button" style="position:absolute; right:0; bottom:5px;">-</button>
        `;

        const nameEl = row.querySelector(".row-name");
        const removeBtn = row.querySelector(".remove");

        nameEl.addEventListener("input", updatePreview);

        removeBtn.addEventListener("click", () => {
            row.remove();
            updatePreview();
        });

        container.appendChild(row);
    });

    function updatePreview() {
        const rows = container.querySelectorAll(".dyn-row");
        let html = "";

        rows.forEach(row => {
            const name = row.querySelector(".row-name").value.trim();
            if (name === "") return;
            html += `<li>${name}</li>`;
        });

        if (html === "") {
            outBlock.classList.add("cv-hidden");
            outList.classList.add("cv-hidden");
            outList.innerHTML = "";
        } else {
            outBlock.classList.remove("cv-hidden");
            outList.classList.remove("cv-hidden");
            outList.innerHTML = html;
        }
    }
}

setupAddSection({
    label: "Certificate",
    addBtnId: "cert-add",
    containerId: "certcontanier",
    outBlockId: "cert-block",
    outListId: "out-certificates",
    placeholder: "Ex: AWS Certified Developer"
});

setupAddSection({
    label: "Internship",
    addBtnId: "intern-add",
    containerId: "interncontanier",
    outBlockId: "intern-block",
    outListId: "out-internships",
    placeholder: "Ex: Software Intern at Google"
});

setupAddSection({
    label: "Volunteer",
    addBtnId: "volunteer-add",
    containerId: "volunteercontanier",
    outBlockId: "volunteer-block",
    outListId: "out-volunteerings",
    placeholder: "Ex: Red Cross Volunteer"
});

const downloadPdfBtn = document.getElementById("download-pdf-btn");


if (downloadPdfBtn) {

    downloadPdfBtn.addEventListener("click", () => {
        const nameval = document.getElementById("name").value.trim();
        const surnameval = document.getElementById("surname").value.trim();
        const fullname = `${nameval} ${surnameval}`.trim();
        const cvElement = document.querySelector(".cv-header").closest(".rightside");

        window.scrollTo(0, 0);

        const originalOverflow = cvElement.style.overflow;
        const originalHeight = cvElement.style.height;
        const originalPosition = cvElement.style.position;
        const originalWidth = cvElement.style.width;

        cvElement.style.overflow = "visible";
        cvElement.style.height = "auto";
        cvElement.style.position = "static";
        cvElement.style.width = cvElement.offsetWidth + "px"; // ← enini sabit saxlayırıq

        const opt = {
            margin: 0,
            filename: `${fullname || "CV"}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        setTimeout(() => {
            html2pdf().set(opt).from(cvElement).save().then(() => {
                cvElement.style.overflow = originalOverflow;
                cvElement.style.height = originalHeight;
                cvElement.style.position = originalPosition;
                cvElement.style.width = originalWidth;
            });
        }, 200);
    });
}