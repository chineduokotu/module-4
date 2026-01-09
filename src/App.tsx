import React from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Import the new flat module
import CustomerRoutes from './modules/customer-ar';

setupIonicReact();

const theme = createTheme({
    palette: {
        primary: {
            main: '#3880ff',
        },
        secondary: {
            main: '#00d1b2',
        },
    },
});

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <IonApp>
            <IonReactRouter>
                {/* Use the new CustomerRoutes component */}
                <CustomerRoutes />
                
                {/* Default redirect */}
                <Route exact path="/">
                    <Redirect to="/customers" />
                </Route>
            </IonReactRouter>
        </IonApp>
    </ThemeProvider>
);

export default App;
