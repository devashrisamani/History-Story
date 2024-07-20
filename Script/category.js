// Define an object 'data' with a resource_id that will be used in the AJAX request.
var data = {
    resource_id: '7b89d80d-c74e-4647-bfa7-d1538b068a94', // the resource id
};

// Make an AJAX request to a specific URL to retrieve data.
$.ajax({
    url: 'https://data.sa.gov.au/data/api/3/action/datastore_search',
    data: data,
    dataType: 'json',
    success: function(data) {
        if (data.result && data.result.records.length > 0) {
            var seriesAndCollectionsDiv = document.getElementById('seriesAndCollections');
            var uniqueSeriesAndCollections = new Set();

            data.result.records.forEach(function(record) {
                var seriesCollectionInfo = record["SERIES/COLLECTION"];
                if (seriesCollectionInfo) {
                    var seriesCollectionArray = seriesCollectionInfo.split(';');
                    seriesCollectionArray.forEach(function(item) {
                        uniqueSeriesAndCollections.add(item.trim());
                    });
                }
            });

            // Create an HTML table to display the unique series and collections.
            var table = document.createElement('table');
            table.className = 'series-collection-table';

            var count = 0;
            var row = table.insertRow();
            // Iterate through unique series and collections and create links.
            uniqueSeriesAndCollections.forEach(function(item) {
                if (count === 3) {
                    row = table.insertRow();
                    count = 0;
                }
                var cell = row.insertCell();
                var categoryLink = document.createElement('a');
                categoryLink.textContent = item;
                categoryLink.className = 'category-link';
                categoryLink.href = 'finalindex.html?category=' + encodeURIComponent(item); // Pass the category as a query parameter
                cell.appendChild(categoryLink);
                count++;
            });

            seriesAndCollectionsDiv.appendChild(table);
        } else {
            document.getElementById('seriesAndCollections').textContent = 'No series and collections found.';
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('API request failed:', textStatus, errorThrown);
        document.getElementById('seriesAndCollections').textContent = 'API request failed.';
    }
});