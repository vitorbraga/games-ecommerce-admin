import * as React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Category } from '../../../modules/category/model';
import * as CategoriesApi from '../../../modules/category/api';

interface Props {
    index: number;
    parentId: string;
    selectedValue: string;
    onChangeCategory: (categoryId: string) => void;
}

interface State {
    parentId: string;
    values: Category[];
}

export const UNSELECTED_PARENT = '0';

export class CategoryDropdown extends React.PureComponent<Props, State> {
    public state: State = {
        parentId: this.props.parentId,
        values: []
    };

    public async componentDidMount() {
        const { parentId } = this.props;
        const result = await CategoriesApi.getSubCategoriesByParentId(parentId !== UNSELECTED_PARENT ? parentId : null);
        this.setState({ values: result });
    }

    private handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChangeCategory(event.target.value);
    };

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
