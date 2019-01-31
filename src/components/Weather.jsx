import React, { Component } from 'react';
import Script from 'react-load-script';
import axios from 'axios';

class Weather extends Component {

    state = {
        details: {
            city: '',
            temp: '',
            humid: '',
            weather: ''
        },
        spinner: false
    }

    handleScriptLoad = () => {
        // Declare Options For Autocomplete
        var options = {
            types: ['(cities)'],
        };

        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
            options,
        );

        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }

    handlePlaceSelect = () => {

        // Extract City From Address Object
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            // Set State
            // this.setState(
            //     {
            //         city: address[0].long_name,
            //         query: addressObject.formatted_address,
            //     }
            // );
            console.log(address[0].long_name);
            this.setState({ spinner: true });
            axios.get(`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${address[0].long_name}&units=metric&appid=${process.env.WEATHER_API}`)
                .then((result) => {
                    console.log(result.data);
                    const { name, main, weather } = result.data;
                    this.setState({
                        details: {
                            city: name,
                            temp: main.temp,
                            humid: main.humidity,
                            weather: weather[0].main
                        },
                        spinner: false
                    });
                    document.getElementById('autocomplete').value = '';
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    render() {
        const weather_url = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLEPLACE_API}&libraries=places`;
        return (
            <div>
                <Script
                    url={weather_url}
                    onLoad={this.handleScriptLoad}
                />
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 offset-md-3">
                            <div class="display-3 text-center my-5">WEATHER APP</div>
                            <form>
                                <div class="form-group">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="ENTER CITY"
                                        id="autocomplete"
                                    />
                                </div>
                            </form>
                            {this.state.spinner &&
                                <div class="text-center">
                                    <div class="spinner-grow text-danger"></div>
                                </div>
                            }
                            {this.state.details.city &&
                                <ul class="list-group">
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <strong><i class="fas fa-city mr-3"></i>CITY</strong>
                                        <span class="badge badge-primary badge-pill p-2">{this.state.details.city}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <strong><i class="fas fa-thermometer-half mr-3"></i>TEMPERATURE</strong>
                                        <span class="badge badge-primary badge-pill p-2">{this.state.details.temp}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <strong><i class="fas fa-tint mr-3"></i>HUMIDITY</strong>
                                        <span class="badge badge-primary badge-pill p-2">{this.state.details.humid}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <strong><i class="fas fa-bolt mr-3"></i>WEATHER</strong>
                                        <span class="badge badge-primary badge-pill p-2">{this.state.details.weather}</span>
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </div>
                <h1>{this.state.weather}</h1>
            </div>
        );
    }
}

export default Weather;