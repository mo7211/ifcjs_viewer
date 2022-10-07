import './App.css';
import { IfcViewerAPI, NavigationModes } from 'web-ifc-viewer';
import { Backdrop, CircularProgress, IconButton, ButtonGroup, Switch, touchRippleClasses } from '@mui/material';

import React from 'react';
import Dropzone from 'react-dropzone';
import BcfDialog from './components/BcfDialog';

//Icons
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CropOutlinedIcon from '@mui/icons-material/CropOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';

import { Color, LineBasicMaterial, MeshBasicMaterial } from 'three';
import Footer from './components/footer';
import Header from './components/header';
import { arrowsKeyControls, wasdKeyControls } from './components/keyControls';




class App extends React.Component {

    state = {
        bcfDialogOpen: false,
        loaded: false,
        loading_ifc: false,
        camera_OrbitMode: true,
        models: [],
        properties: []
    };

    constructor(props) {
        super(props);
        this.dropzoneRef = React.createRef();
    }

    componentDidMount() {
        const container = document.getElementById('viewer-container');
        const viewer = new IfcViewerAPI({ container });
        viewer.axes.setAxes();
        viewer.grid.setGrid();
        viewer.IFC.setWasmPath('../../');

        let color = new Color("rgb(255, 255, 255)")
        viewer.context.getScene().background = color;

        this.viewer = viewer;

        const cameraControls = this.viewer.context.getIfcCamera().cameraControls;
        wasdKeyControls(cameraControls);
        arrowsKeyControls(cameraControls);


        window.onmousemove = viewer.prepickIfcItem;
        window.onclick = viewer.IFC.selector.pickIfcItem(true);
        window.ondblclick = viewer.clipper.createPlane;


        async function setUpMultiThreading() {
            const manager = viewer.IFC.loader.ifcManager;
            // These paths depend on how you structure your project
            await manager.useWebWorkers(true, './IFCWorker.js');
        }

        setUpMultiThreading();

    }



    onDrop = async (files) => {
        this.setState({ loading_ifc: true })
        const viewer = this.viewer;
        const models = [await viewer.IFC.loadIfc(files[0], true)];

        // Add dropped shadow and post-processing efect
        if (models.length !== 0) {
            for (const model in models) {
                viewer.shadowDropper.renderShadow(model.modelID);
            }
        }
        // viewer.context.renderer.postProduction.active = true;

        const properties = [] //await viewer.IFC.properties.serializeAllProperties(models);
        this.setState({ loaded: true, loading_ifc: false, models, properties });
    };

    handleToggleClipping = () => {
        this.viewer.clipper.active = !this.viewer.clipper.active;
    };

    handleClickOpen = () => {
        this.dropzoneRef.current.open();
    };

    handleOpenBcfDialog = () => {
        this.setState({
            ...this.state,
            bcfDialogOpen: true
        });
    };

    handleCloseBcfDialog = () => {
        this.setState({
            ...this.state,
            bcfDialogOpen: false
        });
    };

    handleOpenViewpoint = (viewpoint) => {
        this.viewer.currentViewpoint = viewpoint;
    };

    handleFirstPersonMode = () => {
        const camera = this.viewer.context.getIfcCamera();


        if (this.state.camera_OrbitMode) {
            camera.setNavigationMode(NavigationModes.FirstPerson);
        }
        else {
            camera.setNavigationMode(NavigationModes.Orbit);
            camera.cameraControls.setTarget(0, 0, 0, true);
        }

        this.setState({ camera_OrbitMode: !this.state.camera_OrbitMode })
    }

    handlePlanView = async () => {

        // Setup camera controls
        const controls = this.viewer.context.ifcCamera.cameraControls;
        controls.setPosition(7.6, 4.3, 24.8, false);
        controls.setTarget(-7.1, -0.3, 2.5, false);

        // Generate all plans
        const models = this.state.models;

        const lineMaterial = new LineBasicMaterial({ color: 'black' });
        const baseMaterial = new MeshBasicMaterial({
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
        });

        if (models !== 0) {
            for (const model in models) {
                //  await this.viewer.plans.computeAllPlanViews(model.modelID);

                // await this.viewer.edges.create('example', model.modelID, lineMaterial, baseMaterial);
            }
        }

    }



    render() {
        return (
            <>
                <BcfDialog
                    open={this.state.bcfDialogOpen}
                    onClose={this.handleCloseBcfDialog}
                    onOpenViewpoint={this.handleOpenViewpoint}
                />

                <Header />
                <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                    <Dropzone ref={this.dropzoneRef} onDrop={this.onDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                            </div>
                        )}
                    </Dropzone>
                    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                        <div id='viewer-container' style={{ position: 'relative', height: '100%', width: '100%', background: "white" }} />
                    </div>
                    <aside style={{ width: 50 }}>
                        <IconButton onClick={this.handleClickOpen}>
                            <FolderOpenOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={this.handleToggleClipping}>
                            <CropOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={this.handleOpenBcfDialog}>
                            <FeedbackOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={this.handleFirstPersonMode}>
                            <DirectionsWalkOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={this.handlePlanView}>
                            <MapOutlinedIcon />
                        </IconButton>
                    </aside>
                </div>
                <Backdrop
                    style={{
                        zIndex: 100,
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center"
                    }}
                    open={this.state.loading_ifc}
                >
                    <CircularProgress />
                </Backdrop>
                <Footer />
            </>
        );
    }
}

export default App;

