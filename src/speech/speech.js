import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import style from './style';
import SpeechSynthesis from './speechSynthesis';
import Button from '@material-ui/core/Button';

export default class Speech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: this.props.styles !== undefined ? this.props.styles : style
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.stop = this.stop.bind(this);
    this.onend = this.onend.bind(this);
    this.onerror = this.onerror.bind(this);
  }

  componentDidMount() {
    this.setButtonState('all', 'none', 'none', 'none');
  }

  setButtonState(play, stop, pause, resume) {
    var newState = update(this.state, {
      styles: {
        play: { button: { pointerEvents: { $set: play } } },
        stop: { button: { pointerEvents: { $set: stop } } },
        pause: { button: { pointerEvents: { $set: pause } } },
        resume: { button: { pointerEvents: { $set: resume } } }
      }
    });

    this.setState(newState);
  }

  setSpeechSynthesis() {
    this.speechSynthesis = new SpeechSynthesis(this.props);
    this.speechSynthesis.onend(this.onend);
    this.speechSynthesis.onerror(this.onerror);
  }

  play() {
    this.setSpeechSynthesis();
    this.speechSynthesis.speak();
    this.setButtonState('none', 'all', 'all', 'none');
  }

  pause() {
    this.speechSynthesis.pause();
    this.setButtonState('none', 'all', 'none', 'all');
  }

  resume() {
    this.speechSynthesis.resume();
    this.setButtonState('none', 'all', 'all', 'none');
  }

  stop() {
    this.speechSynthesis.cancel();
    this.setButtonState('all', 'none', 'none', 'none');
  }

  onend() {
    this.stop();
  }

  onerror() {
    this.stop();
  }

  render() {
    if (this.props.disabled || !SpeechSynthesis.supported()) {
      return (
        <span className="rs-container" style={this.state.styles.container}>
          <span className="rs-text" style={this.state.styles.text}>
            {this.props.text}
          </span>
        </span>
      );
    }

    var play;
    var stop;
    var pause;
    var resume;

    if (this.props.textAsButton) {
      play = (
        <Button
          className="rs-play"
          styles={this.state.styles.play}
          onClick={this.play}
          variant="outlined"
          size="small"
        >
          play
        </Button>
      );
    } else {
      play = (
        <Button
          className="rs-play"
          variant="outlined"
          size="small"
          styles={this.state.styles.play}
          onClick={this.play}
        >
         play
        </Button>
      );
    }

    if (this.props.stop) {
      stop = (
        <Button
          className="rs-stop"
          color="secondary"
          size="small"
          variant="outlined"
          styles={this.state.styles.stop}
          onClick={this.stop}
        >
          stop
        </Button>
      );
    }

    if (this.props.pause) {
      pause = (
        <Button
          className="rs-pause"
          variant="outlined"
          size="small"
          color="primary"
          styles={this.state.styles.pause}
          onClick={this.pause}
        >
          pause
        </Button>
      );
    }

    if (this.props.resume) {
      resume = (
        <Button
          className="rs-resume"
          variant="outlined"
          size="small"
          styles={this.state.styles.resume}
          onClick={this.resume}
        >resume
            
        </Button>
      );
    }

    return (
      <span className="rs-container" style={this.state.styles.container}>
        {play} {stop} {pause} {resume}
      </span>
    );
  }
}

Speech.propTypes = {
  styles: PropTypes.object,
  text: PropTypes.string.isRequired,
  pitch: PropTypes.string,
  rate: PropTypes.string,
  volume: PropTypes.string,
  lang: PropTypes.string,
  voiceURI: PropTypes.string,
  voice: PropTypes.string,
  textAsButton: PropTypes.bool,
  displayText: PropTypes.string,
  disabled: PropTypes.bool,
  stop: PropTypes.bool,
  pause: PropTypes.bool,
  resume: PropTypes.bool
};
