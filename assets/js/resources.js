import { SUBJECTS_DATA_NEW } from './subject_data.js';

// Function to generate a subject card HTML
export function generateSubjectCard(subject) {
    // Generate random values for document count, book count, and chat count
    const documentCount = Math.floor(Math.random() * 20) + 5; // 5-24 documents
    const bookCount = Math.floor(Math.random() * 5) + 2;     // 2-6 books
    const chatCount = Math.floor(Math.random() * 15) + 5;    // 5-19 chats

    return `
        <div class="col">
            <a href="subject_detail.html?course_id=${subject.code}" class="course-card text-decoration-none text-dark">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title fw-bold">${subject.name}</h5>
                    <span class="course-code">${subject.code}</span>
                </div>
                <p class="card-text text-secondary mb-3" style="font-size: 0.9rem">
                    ${subject.description}
                </p>
                <div class="card-footer-icons mt-auto pt-2 border-top">
                    <span class="icon-item"><i class="bi bi-file-earmark-text"></i> ${documentCount}</span>
                    <span class="icon-item"><i class="bi bi-book"></i> ${bookCount}</span>
                    <span class="icon-item"><i class="bi bi-chat-dots"></i> ${chatCount}</span>
                </div>
            </a>
        </div>
    `;
}

// Function to populate subjects for a given year, branch, and semester
function populateSubjects(year, branch, semester, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found.`);
        return;
    }

    const subjects = SUBJECTS_DATA_NEW[year]?.[branch]?.[semester];

    let semesterContent = '';
    if (subjects && subjects.length > 0) {
        if (year === 1) { // Year 1 has only 'Common' branch
            semesterContent += `
                <h3 class="semester-title">Semester ${semester}</h3>
                <div class="row row-cols-1 row-cols-md-3 g-4 mb-4">
            `;
        } else {
             semesterContent += `
                <h3 class="semester-title">Semester ${semester} (${branch})</h3>
                <div class="row row-cols-1 row-cols-md-3 g-4 mb-4">
            `;
        }

        subjects.forEach(subject => {
            semesterContent += generateSubjectCard(subject);
        });
        semesterContent += `</div>`;
    } else {
        semesterContent = `<p class="text-muted">No subjects available for Semester ${semester} in ${branch} branch for Year ${year}.</p>`;
    }
    container.innerHTML += semesterContent; // Append content for dynamic loading
}

// Function to dynamically create and populate branch tabs for a given year
function setupBranchTabs(year) {
    const branchTabContentArea = document.getElementById(`year${year}-content`);
    if (!branchTabContentArea) {
        console.error(`Content area for Year ${year} not found.`);
        return;
    }

    // Clear existing content except the initial year header
    const initialHeader = `
        <div class="row">
            <div class="col-12">
                <h1 class="fw-bold">Year ${year} Curriculum</h1>
                <p class="text-secondary mb-4">
                    Select a specialization to view study materials.
                </p>
            </div>
        </div>
    `;
    branchTabContentArea.innerHTML = initialHeader;


    const branches = Object.keys(SUBJECTS_DATA_NEW[year]);
    if (branches.length === 0) {
        branchTabContentArea.innerHTML += `<p class="text-muted">No branches available for Year ${year}.</p>`;
        return;
    }

    let branchSelectorHtml = `
        <div class="branch-selector">
            <ul class="nav nav-pills" id="branchTabsYear${year}" role="tablist">
    `;
    branches.forEach((branch, index) => {
        const activeClass = index === 0 ? 'active' : '';
        branchSelectorHtml += `
            <li class="nav-item">
                <button
                    class="nav-link ${activeClass}"
                    id="${branch.toLowerCase()}-branch-tab-year${year}"
                    data-bs-toggle="pill"
                    data-bs-target="#${branch.toLowerCase()}-content-year${year}"
                    type="button"
                    role="tab"
                >
                    ${branch}
                </button>
            </li>
        `;
    });
    branchSelectorHtml += `
            </ul>
        </div>
        <div class="tab-content" id="branchContentYear${year}">
    `;

    branches.forEach((branch, index) => {
        const activeClass = index === 0 ? 'show active' : '';
        branchSelectorHtml += `
            <div
                class="tab-pane fade ${activeClass}"
                id="${branch.toLowerCase()}-content-year${year}"
                role="tabpanel"
            >
                <div id="semester-content-${branch.toLowerCase()}-year${year}"></div>
            </div>
        `;
    });
    branchSelectorHtml += `</div>`;
    branchTabContentArea.innerHTML += branchSelectorHtml;

    // Populate semester content for each branch
    branches.forEach((branch, index) => {
        const semesterContainerId = `semester-content-${branch.toLowerCase()}-year${year}`;
        const semesters = Object.keys(SUBJECTS_DATA_NEW[year][branch]).sort((a,b) => parseInt(a) - parseInt(b));
        semesters.forEach(semester => {
            populateSubjects(year, branch, parseInt(semester), semesterContainerId);
        });
    });
}


// Event listener for year tabs
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically populate Year 1
    const year1Content = document.getElementById('year1-content');
    if (year1Content) {
        year1Content.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h1 class="fw-bold">Year 1 Curriculum</h1>
                    <p class="text-secondary mb-4">
                        Select a subject to view study materials.
                    </p>
                </div>
            </div>
        `;
        // Populate Semester 1 and Semester 2 for Year 1 (Common)
        populateSubjects(1, 'Common', 1, 'year1-content');
        populateSubjects(1, 'Common', 2, 'year1-content');
    }

    // Setup listeners for other year tabs
    const yearTabs = document.querySelectorAll('#curriculumTabs .nav-link');
    yearTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            const targetId = event.target.dataset.bsTarget; // e.g., #year2-content
            const year = parseInt(targetId.replace('#year', '').replace('-content', ''));

            if (year > 1) { // Only set up branch tabs for years > 1
                setupBranchTabs(year);
            }
        });
    });

    // Manually trigger for the initially active tab (Year 1)
    const activeTab = document.querySelector('#curriculumTabs .nav-link.active');
    if (activeTab) {
        const targetId = activeTab.dataset.bsTarget;
        const year = parseInt(targetId.replace('#year', '').replace('-content', ''));
        if (year > 1) {
             setupBranchTabs(year);
        }
    }
});