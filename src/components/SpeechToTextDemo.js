import React,{ Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Speech from "../speech/speech";
import {
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";
import SpeechToText from "speech-to-text";

import supportedLanguages from "../supportedLanguages";
import supportedLanguagesAudio from "../supportedLanguages_audio";

const styles = theme => ({
  root: {
    paddingTop: 65,
    paddingLeft: 11,
    paddingRight: 11
  },
  flex: {
    flex: 1
  },
  grow: {
    flexGrow: 1
  },
  paper: theme.mixins.gutters({
    paddingTop: 22,
    paddingBottom: 22
  })
});

class SpeechToTextDemo extends Component {
  constructor(props) {
    super(props);

    this.onAnythingSaid = this.onAnythingSaid.bind(this);
    this.onEndEvent = this.onEndEvent.bind(this);
    this.onFinalised = this.onFinalised.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.state = {
      error: "",
      interimText: "",
      interimTextTill: "",
      finalisedText: [],
      listening: false,
      language: "en-US",
      languageAudio: "Google US English"
    };
  }

  onAnythingSaid = (text) => {
    let interimText = this.state.interimTextTill + " " + text 
    this.setState({ interimText });
  };

  onEndEvent = () => {
     if (this.state.listening) {
      this.startListening();
    }
  };

  onFinalised = text => {
    let interimTextTill = this.state.interimTextTill + " " + text 
    this.setState({ interimTextTill });
  };

  startListening = () => {
    try {
      this.listener = new SpeechToText(
        this.onFinalised,
        this.onEndEvent,
        this.onAnythingSaid,
        this.state.language
      );
      this.listener.startListening();
      this.setState({ listening: true });
    } catch (err) {
      console.log("yoyoy");
      console.log(err);
    }
  };

  stopListening = () => {
    this.listener.stopListening();
    this.setState({
      finalisedText: [this.state.interimTextTill,...this.state.finalisedText],
      interimText: "",interimTextTill: "",listening: false
    });
  };

  render() {
    const {
      error,
      interimText,
      finalisedText,
      listening,
      language
    } = this.state;
    const { classes } = this.props;
    let content;
    if (error) {
      content = (
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            {error}
          </Typography>
        </Paper>
      );
    } else {
      let buttonForListening;

      if (listening) {
        buttonForListening = (
          <Button color="primary" onClick={() => this.stopListening()}>
            Stop Listening
          </Button>
        );
      } else {
        buttonForListening = (
          <Button
            color="primary"
            onClick={() => this.startListening()}
            variant="contained"
          >
            Start Listening
          </Button>
        );
      }
      content = (
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
            <Paper className={this.props.classes.paper}>
              <Grid container spacing={8}>
                <Grid item xs={12} lg={6}>
                  <Typography variant="overline" gutterBottom>
                    Status: {listening ? "listening..." : "finished listening"}
                  </Typography>
                  {buttonForListening}
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={language}
                      onChange={evt =>
                        this.setState({ language: evt.target.value })
                      }
                      disabled={listening}
                    >
                      {supportedLanguages.map(language => (
                        <MenuItem key={language[1]} value={language[1]}>
                          {language[0]}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      What language are you going to speak in?
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper className={this.props.classes.paper}>
              <Typography variant="overline" gutterBottom>
                Current utterances
              </Typography>
              <Typography variant="body1" gutterBottom>
                {interimText}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Paper className={classes.paper}>
              <Grid item xs={12} lg={12} style={{ marginTop: "40px" }}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Select Voice For Speech</InputLabel>
                  <Select
                    value={this.state.languageAudio}
                    onChange={evt =>
                      this.setState({ languageAudio: evt.target.value })
                    }
                  >
                    {supportedLanguagesAudio.map((language,index) => (
                      <MenuItem
                        key={`supportedLanguagesAudio${index}`}
                        value={language["name"]}
                      >
                        {language["name"]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    What voice are you going to listen in?
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Finalised Text</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {finalisedText.map((str,index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {str}
                          <Paper style={{ boxShadow:"none"}}>
                            <Speech
                              stop={true}
                              pause={true}
                              resume={true}
                              text={str}
                              voice={this.state.languageAudio}
                            />
                          </Paper>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container>
        <AppBar position="static" style={{ backgroundColor: "#3f51b5ab" }}>
          <Toolbar>
            <img
              src="https://iviewlabs.com/assets/img/landing/logo.jpg"
              alt="logo of iview"
              data-reactid=".0.0"
            />

            <Typography
              variant="h6"
              className={classes.grow}
              color="inherit"
              style={{ textAlign: "center" }}
            >
              Speech-to-text And Text-to-speech
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12} sm={8}>
            {content}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withWidth()(withStyles(styles)(SpeechToTextDemo));
