console.log('Welcome to Library Management System');

class Book {
    constructor(name, author, type) {
        this.name = name;
        this.author = author;
        this.type = type;
    }
}

class Display {
    add(book) {
        let tableBody = document.getElementById('tableBody');
        let uiString =
            `<tr>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.type}</td>
                <td><button class="btn btn-danger btn-sm delete">Delete</button></td>
            </tr>`;
        tableBody.innerHTML += uiString;
    }

    clear() {
        let libraryForm = document.getElementById('libraryForm');
        libraryForm.reset();
    }

    validate(book) {
        if (book.name.length < 2 || book.author.length < 2) {
            return false;
        } else {
            return true;
        }
    }

    show(type, displayMessage) {
        let message = document.getElementById('message');
        let status = type === 'success' ? 'Success' : 'Error';
        message.innerHTML = `<div class="alert alert-${type}" role="alert">
            ${status}: ${displayMessage}
        </div>`;
        setTimeout(() => {
            message.innerHTML = '';
        }, 3000);
    }

    deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
            this.show('success', 'Book deleted successfully.');

            // Update local storage after deletion
            this.updateLocalStorage();
        }
    }

    updateLocalStorage() {
        let tableRows = document.querySelectorAll('#tableBody tr');
        let booksData = [];

        tableRows.forEach(row => {
            let book = {
                name: row.cells[0].textContent,
                author: row.cells[1].textContent,
                type: row.cells[2].textContent
            };
            booksData.push(book);
        });

        localStorage.setItem('booksData', JSON.stringify(booksData));
    }
}

// Event listener for form submission
document.getElementById('libraryForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let type = document.querySelector('input[name="type"]:checked').value;
    let book = new Book(name, author, type);

    let display = new Display();

    if (display.validate(book)) {
        display.add(book);
        display.clear();
        display.show('success', 'Your book has been successfully added.');
    } else {
        display.show('danger', 'Sorry you cannot add this book.');
    }

    // Update local storage after adding a book
    display.updateLocalStorage();
});

// Event listener for table deletion using event delegation
document.getElementById('tableBody').addEventListener('click', function(e) {
    let display = new Display();
    display.deleteBook(e.target);
});

// Functionality to retrieve data from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const messageDiv = document.getElementById('message');
    const searchTxt = document.getElementById('searchTxt');

    // Retrieve data from localStorage if available
    let booksData = JSON.parse(localStorage.getItem('booksData')) || [];

    // Function to render the table with existing data
    const renderTable = () => {
        tableBody.innerHTML = '';
        booksData.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${book.name}</td><td>${book.author}</td><td>${book.type}</td><td><button class="btn btn-danger btn-sm delete">Delete</button></td>`;
            tableBody.appendChild(tr);
        });
    };

    // Initial rendering of table
    renderTable();

    // Function to handle search
    const handleSearch = (event) => {
        event.preventDefault();
        const searchText = searchTxt.value.toLowerCase().trim();

        const filteredBooks = booksData.filter(book => {
            return book.name.toLowerCase().includes(searchText) || 
                   book.author.toLowerCase().includes(searchText) ||
                   book.type.toLowerCase().includes(searchText);
        });

        if (filteredBooks.length > 0) {
            messageDiv.textContent = '';
            tableBody.innerHTML = '';
            filteredBooks.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${book.name}</td><td>${book.author}</td><td>${book.type}</td><td><button class="btn btn-danger btn-sm delete">Delete</button></td>`;
                tableBody.appendChild(tr);
            });
        } else {
            tableBody.innerHTML = '';
            messageDiv.textContent = 'No matching books found.';
        }
    };

    // Event listener for search form submission
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
});
