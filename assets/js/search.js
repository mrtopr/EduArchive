import { SUBJECTS_DATA_NEW } from './subject_data.js';
import { generateSubjectCard } from './resources.js';

// Function to flatten the SUBJECTS_DATA_NEW into a single array of all subjects
function getAllSubjects() {
    const allSubjects = [];
    for (const yearKey in SUBJECTS_DATA_NEW) {
        const yearData = SUBJECTS_DATA_NEW[yearKey];
        for (const branchKey in yearData) {
            const branchData = yearData[branchKey];
            for (const semesterKey in branchData) {
                const subjectsInSemester = branchData[semesterKey];
                allSubjects.push(...subjectsInSemester);
            }
        }
    }
    return allSubjects;
}

const ALL_SUBJECTS = getAllSubjects();

// Function to filter subjects based on search query
export function filterSubjects(query) {
    if (!query) {
        return ALL_SUBJECTS;
    }
    const lowerCaseQuery = query.toLowerCase();
    return ALL_SUBJECTS.filter(subject =>
        subject.name.toLowerCase().includes(lowerCaseQuery) ||
        subject.code.toLowerCase().includes(lowerCaseQuery) ||
        subject.description.toLowerCase().includes(lowerCaseQuery)
    );
}

// Function to display subjects in a given container
export function displaySubjects(subjects, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found.`);
        return;
    }

    container.innerHTML = ''; // Clear previous content

    if (subjects.length > 0) {
        let content = `<div class="row row-cols-1 row-cols-md-3 g-4 mb-4">`;
        subjects.forEach(subject => {
            content += generateSubjectCard(subject);
        });
        content += `</div>`;
        container.innerHTML = content;
    } else {
        container.innerHTML = `<p class="text-muted text-center mt-5">No subjects found matching your search.</p>`;
    }
}

export function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const resourcesContent = document.getElementById('resources-content');

    if (!searchInput) {
        console.warn('Search input not found');
        return;
    }

    if (searchInput && resourcesContent) {
        // We're on resources.html - enable real-time search
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            const filtered = filterSubjects(query);
            displaySubjects(filtered, 'resources-content');
        });
    } else if (searchInput && !resourcesContent) {
        // We're NOT on resources.html - redirect on Enter
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `resources.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}