const accessKey = 'KDLuPFYp1DU3xCttfFBYdkAFhdfjffXg1C49NW_Sj1U'; 
let images = []; 
let currentPage = 1; 
const photosPerPage = 20; 
let currentIndex = 0; 
let totalImages = 0; 

function fetchImages() {
    $.ajax({
        url: `https://api.unsplash.com/photos?client_id=${accessKey}&page=${currentPage}&per_page=${photosPerPage}`,
        method: 'GET',
        success: function (data) {
            totalImages += data.length; 
            images = images.concat(data);
            displayImages(data);
            updatePaginationInfo(); 
        },
        error: function (error) {
            console.error("Error fetching images:", error);
        }
    });
}

function displayImages(data) {
    const gallery = $('#gallery');
    data.forEach((image) => {
        const imgElement = `
        <div>
            <img src="${image.urls.small}" alt="${image.alt_description}" data-id="${image.id}" data-index="${images.indexOf(image)}">
            <div class="content-div">
                <span class="txt-div1">Photographer: ${image.user.name}</span>
                <span class="txt-div2">Location: ${image.user.location !== null ? image.user.location : 'N/A'}</span>
                <span class="txt-div3">Likes: ${image.likes !== undefined ? image.likes : 'N/A'}</span>
            </div>
        </div>
        `;
        gallery.append(imgElement); 
    });
}

function updatePaginationInfo() {
    $('#pagination-info').text(`Page ${currentPage} | Total Images: ${totalImages}`);
}

$(document).on('click', 'img', function () {
    currentIndex = $(this).data('index');
    showImageDetails(currentIndex); 
    $('#modal').show(); 
});

function showImageDetails(index) {
    const image = images[index]; 
    $('#image-title').text(image.alt_description || 'No Title'); 
    $('#image-detail').attr('src', image.urls.regular); 
    $('#image-meta').text(`Photographer: ${image.user.name} | Likes: ${image.likes}`); 
}

$('#prev-btn').on('click', function () {
    if (currentIndex > 0) {
        currentIndex--; 
        showImageDetails(currentIndex);
    }
});

$('#next-btn').on('click', function () {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        showImageDetails(currentIndex);
    }
});

$('.close').on('click', function () {
    $('#modal').hide(); 
});

// Fetch next set of images when scrolling to bottom
$(window).on('scroll', function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
        currentPage++; 
        fetchImages(); 
    }
});

// Initial fetch for images
$(document).ready(function () {
    fetchImages(); 
    
});
