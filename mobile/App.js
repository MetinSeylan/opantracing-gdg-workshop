import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList} from 'react-native';
import {Tracer, ExplicitContext, BatchRecorder, jsonEncoder, Annotation} from 'zipkin';
import wrapFetch from 'zipkin-instrumentation-fetch';
import {HttpLogger} from 'zipkin-transport-http';


const tracer = new Tracer({
    ctxImpl: new ExplicitContext(),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: 'http://localhost:3000/frontendProxy',
            jsonEncoder: jsonEncoder.JSON_V1
        })
    }),
    localServiceName: 'frontend-ios'
});

const client = wrapFetch(fetch, {tracer, remoteServiceName: 'gateway-service'});

export default class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            drivers: []
        }
    }

    async getDrivers(){

        const response = await tracer.local("home-page-actions", async () => {
            tracer.recordMessage("button pressed");
            tracer.recordBinary("user_id", "1150");
            const result = await client('http://localhost:3000/getAllOrders', { method: 'GET' });
            return result.json();
        });

        this.setState(() => ({
            drivers: response.drivers
        }));

    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.buttons}>


                    <Button
                        onPress={() => this.getDrivers()}
                            title="Get Drivers"
                        color="blue"
                    />
                </View>
                <View style={styles.list}>
                    <FlatList
                        data={this.state.drivers}
                        renderItem={(item) => <Text key={item.index} style={styles.item}>{item.item.name} {item.item.surname} - {item.item.vehicle}</Text>}
                    />
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    buttons: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center',
        padding: 10
    }
});
