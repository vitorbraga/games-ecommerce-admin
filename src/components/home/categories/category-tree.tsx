import * as React from 'react';
import { Category } from '../../../modules/category/model';
import * as CategoriesApi from '../../../modules/category/api';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';

import * as theme from './category-tree.scss';

interface Props {
    selectedCategoryId?: string;
    onSelectCategory?: (categoryId: string) => void;
    onDelete?: (category: Category) => void;
}

interface State {
    categories: Category[];
    loadingMapStatus: FetchStatus;
    selectedCategoryId: string | null;
}

export class CategoryTree extends React.PureComponent<Props, State> {
    public state: State = {
        categories: [],
        loadingMapStatus: FetchStatusEnum.initial,
        selectedCategoryId: null
    };

    public componentDidMount() {
        this.setState({ loadingMapStatus: FetchStatusEnum.loading }, async () => {
            try {
                const categories = await CategoriesApi.getFullCategoryTrees();
                this.setState({ categories, loadingMapStatus: FetchStatusEnum.success });
            } catch (error) {
                this.setState({ loadingMapStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleSelectCategory = (categoryId: string) => () => {
        if (this.props.onSelectCategory) {
            this.props.onSelectCategory(categoryId);
        }
    };

    private handleDeleteCategory = (category: Category) => () => {
        if (this.props.onDelete) {
            this.props.onDelete(category);
        }
    };

    private renderCategory(category: Category): React.ReactNode {
        const { selectedCategoryId, onSelectCategory, onDelete } = this.props;
        const { id, subCategories, label } = category;

        return (
            <div className={theme.categoryItem} key={`categ-${id}`}>
                <Chip
                    label={label}
                    color={selectedCategoryId === category.id ? 'primary' : 'secondary'}
                    onClick={onSelectCategory && this.handleSelectCategory(category.id)}
                    onDelete={onDelete && this.handleDeleteCategory(category)}
                    title="Delete sub categories"
                />
                {subCategories
                    && subCategories.length > 0
                    && subCategories.map((item) => {
                        return this.renderCategory(item);
                    })
                }
            </div>
        );
    }

    private renderCategoryMap() {
        const { categories, loadingMapStatus } = this.state;

        if (loadingMapStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (loadingMapStatus === FetchStatusEnum.failure) {
            return <div>Failed</div>;
        } else if (loadingMapStatus === FetchStatusEnum.success) {
            return categories.map((category) => this.renderCategory(category));
        }

        return null;
    }

    public render() {
        return (
            <div className={theme.categoryTree}>
                {this.renderCategoryMap()}
            </div>
        );
    }
}
