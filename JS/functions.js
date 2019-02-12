$(document).ready(function () {

    function searchFilter(config) {
        var { url, method } = config;
        console.log(url);
        makeAjaxCall(url, method).then(function (result) {
            $('.result-container').empty();
            $('.err').remove();
            var person = result;
            if (person.length) {
                for (var item in person) {

                    // Destructured person object
                    var { first_name, last_name, list_agency_desc, list_no, list_title_desc, published_date } = person[item];

                    var card_content = '<div class="card col-sm-4"><div class="card-content">' +
                        '<div class="card-item"><p class="first-name">' + first_name + '</p><p class="last-name">' + last_name + '</p></div>' +
                        '<div class="card-item"><p class="agency-desc">' + list_agency_desc + '</p><p class="agency-no">' + list_no + '</p></div>' +
                        '<div class="card-item"><p class="list_title_desc">' + list_title_desc + '</p><p class="published_date">' + published_date + '</p></div>' +
                        '</div></div>';

                    $('.result-container').append(card_content);
                    $('.search-tag').removeClass('hide');
                }
            }
            else {
                var error_content = '<div class=err>No results found</div>';
                $('.result-container').append(error_content);
            }
        },
            function (reason) {
                console.log("Error in processing your request", reason);
            });
    }

    $(document).on('click', '#search-btn', function () {
        prepareCall();
    });


    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            prepareCall();
        }
    });
    function makeAjaxCall(url, methodType) {
        return $.ajax({
            url: url,
            method: methodType,
            dataType: "json",
        });
    }
    function prepareCall() {
        var config = {
            url: null,
            method: "GET"
        }
        var firstName = $('#first-name').val().replace(/\s+/g, '');
        var lastName = $('#last-name').val().replace(/\s+/g, '');

        if (firstName != "" && lastName != "") {
            config.url = "https://data.cityofnewyork.us/resource/5scm-b38n.json?first_name=" + firstName + "&last_name=" + lastName + "";

        }
        else if (firstName == "" && lastName != "") {
            config.url = "https://data.cityofnewyork.us/resource/5scm-b38n.json?last_name=" + lastName + "";
        }
        else if (firstName != "" && lastName == "") {
            config.url = "https://data.cityofnewyork.us/resource/5scm-b38n.json?first_name=" + firstName + "";
        }
        else {
            config.url = "https://data.cityofnewyork.us/resource/5scm-b38n.json";
        }
        loader();
        setTimeout(() => {
            searchFilter(config);
        }, 2000);
    }

    function loader(_success) {
        var obj = $('.preloader'),
            inner = $('.preloader_inner');
        $(obj).addClass('show');
        var w = 0,
            t = setInterval(function () {
                w = w + 1;
                $(inner).text(w + '% Waiting for results');
                if (w === 100) {
                    $(obj).removeClass('show');
                    clearInterval(t);
                    w = 0;
                    if (_success) {
                        return _success();
                    }
                }
            }, 20);
    }
});