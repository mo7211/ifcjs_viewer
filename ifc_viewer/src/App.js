import './App.css';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Backdrop, CircularProgress, IconButton, ButtonGroup, Switch } from '@mui/material';
import React from 'react';
import Dropzone from 'react-dropzone';
import BcfDialog from './components/BcfDialog';

//Icons
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CropOutlinedIcon from '@mui/icons-material/CropOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import { Color } from 'three';
import Footer from './components/footer';
import Header from './components/header';




class App extends React.Component {

    state = {
        bcfDialogOpen: false,
        loaded: false,
        loading_ifc: false,
        models: [null],
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

        // viewer.shadowDropper.renderShadow(0);
        viewer.context.renderer.postProduction.active = true;

        this.viewer = viewer;

        window.onmousemove = viewer.prepickIfcItem;
        window.onclick = viewer.IFC.selector.pickIfcItem(true);
        window.ondblclick = viewer.clipper.createPlane;


        async function setUpMultiThreading() {
            const manager = viewer.IFC.loader.ifcManager;
            // These paths depend on how you structure your project
            await manager.useWebWorkers(true, '../IFCWorker.js');
        }

        setUpMultiThreading();

    }



    onDrop = async (files) => {
        this.setState({ loading_ifc: true })
        const models = [await this.viewer.IFC.loadIfc(files[0], true)];
        const properties = await this.viewer.IFC.properties.serializeAllProperties(models);
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
                        <IconButton>
                            <AccessibilityNewOutlinedIcon />
                        </IconButton>
                    </aside>
                    <Dropzone ref={this.dropzoneRef} onDrop={this.onDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />˚
                            </div>
                        )}
                    </Dropzone>
                    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                        <div id='viewer-container' style={{ position: 'relative', height: '100%', width: '100%', background: "white" }} />
                    </div>
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
