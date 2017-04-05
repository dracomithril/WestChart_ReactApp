/**
 * Created by Gryzli on 05.04.2017.
 */

let showDays = 7;
const create_control = (control, action) => {
    if (control.id === action.id) {
        switch (action.type) {
            case 'TOGGLE_FILTER':
                return Object.assign({}, control, {checked: action.checked});
            case 'UPDATE_DAYS':
                return Object.assign({}, control, {days: action.value});
            default:
                return control;
        }
    } else {
        return control;
    }
};
const user = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_USER':
            return action.user;
        default:
            return state;
    }
};
const chart = (state = [], action) => {
    return action.type === 'UPDATE_CHART' ? action.chart : state;
};


let filters = (state = {}, action) => {
    return {
        add_control: create_control(state.add_control || {checked: true, id: 'add', days: showDays}, action),
        create_control: create_control(state.create_control || {checked: false, id: 'create', days: showDays}, action),
        update_control: create_control(state.update_control || {checked: false, id: 'update', days: showDays}, action),
        less_control: create_control(state.less_control || {checked: false, id: 'less', days: 15}, action),
        more_control: create_control(state.more_control || {checked: false, id: 'more', days: 0}, action),
        woc_control: create_control(state.woc_control || {checked: true, id: 'woc'}, action)
    }
};
let reducers = {
    filters: filters, user: user, chart: chart
};
export default reducers;