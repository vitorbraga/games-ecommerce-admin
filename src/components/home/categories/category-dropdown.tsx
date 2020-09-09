import * as React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Category } from '../../../modules/category/model';
import * as CategoriesApi from '../../../modules/category/api';

interface Props {
    index: number;
    parentId: number;
    selectedValue: number;
    onChangeCategory: (categoryId: number) => void;
}

interface State {
    parentId: number;
    values: Category[];
}

export class CategoryDropdown extends React.PureComponent<Props, State> {
    public state: State = {
        parentId: this.props.parentId,
        values: []
    };

    public async componentDidMount() {
        const { parentId } = this.props;
        const result = await CategoriesApi.getSubCategoriesByParentId(parentId);
        this.setState({ values: result });
    }

    private handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChangeCategory(parseInt(event.target.value, 10));
    }

    public render() {
        const { index, selectedValue } = this.props;
        const { values } = this.state;

        return (
            <Select
                fullWidth
                id={`category-selector-${index}`}
                value={selectedValue}
                onChange={this.handleChangeCategory}
            >
                {values.map((category, index) => {
                    return (
                        <MenuItem key={`menuitem-categ-${index}`} value={category.id}>{category.label}</MenuItem>
                    );
                })}
            </Select>
        );
    }
}
