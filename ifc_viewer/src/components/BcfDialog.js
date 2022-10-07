import { useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { BcfReader } from '@parametricos/bcf-js';
import { makeStyles, withStyles } from 'tss-react/mui'
import { Card, CardActionArea, CardContent, CardMedia, Button } from '@mui/material';

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function BcfDialog(props) {

    const { onOpenViewpoint, ...rest } = props;

    const [file, setFile] = useState();
    const [topics, setTopics] = useState([]);

    const handleOpenViewpoint = (viewpoint) => {
        onOpenViewpoint(viewpoint);
        props.onClose()
    }

    const onDrop = useCallback(async (acceptedFiles) => {
        const reader = new BcfReader();
        await reader.read(acceptedFiles[0]);
        setTopics(reader.topics);
        setFile(acceptedFiles[0])
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ".bcf" });

    const fitleredTopics = topics.filter((t) => t.viewpoints.length > 0);

    return (
        <Dialog maxWidth='xl' fullWidth disableBackdropClick {...rest}>
            <DialogTitle>BCF Viewer</DialogTitle>
            <DialogContent>
                {!file && (
                    <Box
                        height={600}
                        display='flex'
                        alignItems="center"
                        justifyContent="center"
                        border={isDragActive ? "solid 4px" : "none"}
                        borderColor={isDragActive ? "#ffa50f" : ""}
                        borderRadius={20}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <Typography variant="h6">Drop the BCF here ...</Typography> :
                                <Typography variant="h6">Drag 'n' drop a BCF here, or click to select</Typography>
                        }
                    </Box>
                )}
                {file && (
                    <Grid container spacing={2}>
                        {fitleredTopics.map((topic, i) => (
                            <Grid key={i} item>
                                <TopicCard topic={topic} onOpenViewpoint={handleOpenViewpoint} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function TopicCard(props) {

    const classes = useStyles();

    const { topic, onOpenViewpoint } = props;

    const defaultViewpoint = topic?.markup?.viewpoints?.length > 0 ? topic.markup.viewpoints[0] : null;

    const [defaultViewpointUrl, setDefaultViewpointUrl] = useState("");

    const handleClick = () => {
        if (topic.viewpoints.length > 0) {
            onOpenViewpoint(topic.viewpoints[0]);
        }
    }

    useEffect(() => {
        const getViewpoint = async () => {
            if (defaultViewpoint) {
                const data = await topic.getViewpointSnapshot(defaultViewpoint);
                const url = window.URL.createObjectURL(data);
                setDefaultViewpointUrl(url);
            }
        }
        getViewpoint()
    }, [defaultViewpoint, topic]);

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={handleClick}>
                <CardMedia
                    className={classes.media}
                    image={defaultViewpointUrl}
                    title={topic.markup.topic.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {topic.markup.topic.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {topic.markup.topic.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/*<CardActions>
              <Button size="small" color="primary">
                  Open
              </Button>
              <Button size="small" color="primary">
                  Learn More
              </Button>
          </CardActions>*/}
        </Card>
    )
}