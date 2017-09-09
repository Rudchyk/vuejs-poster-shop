var PRICE = 9.99,
    LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE,
        results: []
    },
    computed: {
        noMoreItems: function() {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function () {
        var elem = document.getElementById('product-list-bottom'),
            watcher = scrollMonitor.create(elem),
            self = this;

        this.onSubmit();

        watcher.enterViewport(function() {
            self.appendItems();
        });
    },
    methods: {
        appendItems: function () {
            var append;

            if (this.items.length < this.results.length) {
                append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        addItem: function (index) {
            this.total += 9.99;

            var item = this.items[index],
                found = false;

            for (var i = 0; i < this.cart.length; i++) {
                if (item.id === this.cart[i].id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }

            if(!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
            
        },
        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },
        edc: function (item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },
        onSubmit: function () {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(
                        function(response) {
                            this.lastSearch = this.newSearch;
                            this.results = response.data;
                            this.appendItems();
                            this.loading = false;
                        },
                        function(response) {
                            alert('Error');
                        }
                    );
            } else {
                alert('Please, enter the value in the search field');
            }
        }
    }
});