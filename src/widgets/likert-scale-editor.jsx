import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet, css } from "aphrodite";
import { LikertFaces } from './likert-scale.jsx';

const styles = StyleSheet.create({
    face: {
        display: 'inline-block',
        width: 30,
        height: 30,
        margin: 5,
        verticalAlign: 'middle',
    },
});

class LikertScaleEditor extends React.Component {
    static propTypes = {
        labels: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        labels: ["", "", "", ""],
    };

    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            Choice Labels:
            {this.props.labels.map((label, i) => (
                <div>
                    <img className={css(styles.face)} src={LikertFaces[i]} alt="" />
                    <input type="text" className={css(styles.labelInput)} value={label} onChange={(e) => this._changeLabel(i, e.target.value)} />
                </div>
            ))}
        </div>
    }

    _changeLabel = (index, newLabel) => {
        this.props.onChange({
            labels: this.props.labels.map((label, i) => i === index ? newLabel : label),
        });
    };

    serialize() {
        return {
            labels: this.props.labels,
        };
    }
}

export default LikertScaleEditor;
