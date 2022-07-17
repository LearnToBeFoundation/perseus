import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet, css } from "aphrodite";
import Likert1 from "./likert-scale/likert-face-1.svg";
import Likert2 from "./likert-scale/likert-face-2.svg";
import Likert3 from "./likert-scale/likert-face-3.svg";
import Likert4 from "./likert-scale/likert-face-4.svg";

export const LikertFaces = [Likert1, Likert2, Likert3, Likert4];

const styles = StyleSheet.create({
    container: {
        // create a new stacking context:
        position: 'relative',
        // TODO(aria): better approach to scratchpad z-indexing
        zIndex: 3, // to match #problemaria > button
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    choice: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        zIndex: 0,
        borderWidth: 1,
        borderRadius: 0,
        marginRight: -1,
        borderColor: 'gray',
        backgroundColor: '#eee',
        padding: 15,
        ':hover': {
            zIndex: 1,
            outline: '2px solid aqua',
        },
        ':focus-visible': {
            zIndex: 1,
            outline: '2px solid aqua',
        },
        ':active': {
            backgroundColor: 'deepskyblue',
        },
    },
    first: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    last: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        marginRight: 0,
    },
    selectedChoice: {
        backgroundColor: 'deepskyblue',
    },
    face: {
        display: 'block',
        height: 50,
        width: 50,
        marginBottom: 5,
    },
});

class LikertChoice extends React.PureComponent {
    static propTypes = {
        value: PropTypes.number.isRequired,
        onSelect: PropTypes.func.isRequired,
        image: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    };

    render = () => {
        const isSelected = this.props.selected === this.props.value;
        return <button
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={css(styles.choice, this.props.value === 1 && styles.first, this.props.value === 4 && styles.last, isSelected && styles.selectedChoice)}
            onClick={this._handleSelect}
        >
            <img className={css(styles.face)} src={this.props.image} alt={this.props.alt} title={this.props.alt} />
            {this.props.label}
        </button>;
    }

    _handleSelect = () => {
        this.props.onSelect(this.props.value);
    }
}

class LikertScale extends React.PureComponent {
    static propTypes = {
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        selected: PropTypes.oneOf([null, 1, 2, 3, 4]),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        selected: null,
    };

    constructor(props) {
        super(props)
    }

    render = () => {
        return <div role="radiogroup" className={css(styles.container)}>
            {this.props.labels.map((label, index) => (
                <LikertChoice
                    value={index + 1}
                    image={LikertFaces[index]}
                    label={label}
                    selected={this.props.selected}
                    onSelect={this._handleChoice}
                />
            ))}
        </div>;
    };

    _handleChoice = (selected) => {
        this.props.onChange({selected: selected});
    };

    getUserInput = () => {
        return {
            selected: this.props.selected,
            label: this.props.selected == null ? null :
                this.props.labels[this.props.selected - 1],
        };
    };

    simpleValidate = (rubric, onInputError) => {
        if (this.props.selected == null) {
            return {
                type: "invalid",
                message: null,
            };
        }
        return {
            type: "points",
            earned: 1,
            total: 1,
        };
    };
}

const editorPropsToWidgetProps = (editorProps) => {
    return {
        labels: editorProps.labels
    };
};


const LikertScaleInfo = {
    name: "likert-scale",
    displayName: "Likert Scale",

    // Tell the renderer what type of `display:` style we would like
    // for the component wrapping this one.
    defaultAlignment: "block",

    widget: LikertScale,

    transform: editorPropsToWidgetProps,
};

export default LikertScaleInfo;
