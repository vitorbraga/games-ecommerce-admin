import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { Category } from '../../../modules/category/model';
import * as CategoriesApi from '../../../modules/category/api';
import { CategoryDropdown } from './category-dropdown';
import { FetchStatus, FetchStatusEnum } from '../../../utils/api-helper';
import { ResultMessageBox } from '../../../widgets/result-message-box';
import { CategoryTree } from './category-tree';

import * as theme from './categories.scss';

interface CategoryCreation {
    parentIds: string[];
    key: string;
    label: string;
}

interface Props {
    authToken: string;
}

interface State {
    categories: Category[];
    loadingMapStatus: FetchStatus;
    creatingCategoryStatus: FetchStatus;
    newCategory: boolean;
    categoryCreation: CategoryCreation;
}

export class Categories extends React.PureComponent<Props, State> {
    private static unselectedParent = '0';
    private static emptyCategoryCreation = {
        parentIds: [],
        key: '',
        label: ''
    };

    public state: State = {
        categories: [],
        loadingMapStatus: FetchStatusEnum.initial,
        creatingCategoryStatus: FetchStatusEnum.initial,
        newCategory: false,
        categoryCreation: { ...Categories.emptyCategoryCreation }
    };

    public componentDidMount() {
        this.loadFullCategoryTree();
    }

    private loadFullCategoryTree() {
        this.setState({ loadingMapStatus: FetchStatusEnum.loading }, async () => {
            try {
                const categories = await CategoriesApi.getFullCategoryTrees();
                this.setState({ categories, loadingMapStatus: FetchStatusEnum.success });
            } catch (error) {
                console.log(error);
                this.setState({ loadingMapStatus: FetchStatusEnum.failure });
            }
        });
    }

    private handleClickChooseParent = () => {
        if (!this.state.categoryCreation.parentIds.includes(Categories.unselectedParent)) {
            this.setState((prevState) => {
                const newParentIds = [...prevState.categoryCreation.parentIds];
                newParentIds.push(Categories.unselectedParent);
                return { categoryCreation: { ...prevState.categoryCreation, parentIds: newParentIds } };
            });
        }
    };

    private handleShowNewCategory = () => {
        this.setState({ newCategory: true });
    };

    private handleHideNewCategory = () => {
        this.setState({ newCategory: false });
    };

    private handleSubmitCreateCategory = () => {
        const { authToken } = this.props;
        const { categoryCreation: { key, label, parentIds } } = this.state;

        this.setState({ creatingCategoryStatus: FetchStatusEnum.loading }, async () => {
            try {
                await CategoriesApi.createCategory(authToken, parentIds[parentIds.length - 1], key, label);
                const categories = await CategoriesApi.getFullCategoryTrees();
                this.setState({
                    categories,
                    creatingCategoryStatus: FetchStatusEnum.success,
                    newCategory: false,
                    categoryCreation: { ...Categories.emptyCategoryCreation }
                });
            } catch (error) {
                this.setState({ creatingCategoryStatus: FetchStatusEnum.failure });
            }
        });
    };

    private isSubmitButtonDisabled = () => {
        const { categoryCreation: { key, label }, creatingCategoryStatus } = this.state;
        return creatingCategoryStatus === FetchStatusEnum.loading || !key || !label;
    };

    private handleCategorySelect = (index: number) => (categoryId: string) => {
        this.setState((prevState) => {
            const newParentIds = [...prevState.categoryCreation.parentIds];
            newParentIds[index] = categoryId;
            return {
                categoryCreation: {
                    ...prevState.categoryCreation,
                    parentIds: newParentIds
                }
            };
        });
    };

    private handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ categoryCreation: { ...this.state.categoryCreation, key: event.target.value } });
    };

    private handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ categoryCreation: { ...this.state.categoryCreation, label: event.target.value } });
    };

    private handleRemoveCategorySelect = () => {
        this.setState((prevState) => {
            const newParentIds = [...prevState.categoryCreation.parentIds];
            newParentIds.pop();
            return {
                categoryCreation: {
                    ...prevState.categoryCreation,
                    parentIds: newParentIds
                }
            };
        });
    };

    private renderCreatingCategoryStatus() {
        const { creatingCategoryStatus } = this.state;

        if (creatingCategoryStatus === FetchStatusEnum.loading) {
            return <div className={theme.loadingCircle}><CircularProgress /></div>;
        } else if (creatingCategoryStatus === FetchStatusEnum.failure) {
            return <ResultMessageBox type="error" message="Failed creating category. Please try again." />;
        } else if (creatingCategoryStatus === FetchStatusEnum.success) {
            return <ResultMessageBox type="success" message="Category created successfully." />;
        }

        return null;
    }

    private isChooseParentButtonDisabled() {
        return this.state.newCategory;
    }

    private isNewCategoryButtonDisabled() {
        const { categoryCreation: { parentIds }, newCategory } = this.state;
        return newCategory || parentIds.includes(Categories.unselectedParent);
    }

    private renderCreationWizard() {
        const { categoryCreation: { parentIds }, newCategory } = this.state;

        return (
            <div className={theme.createWrapper}>
                {this.renderCreatingCategoryStatus()}
                <div className={theme.parentsWrapper}>
                    {parentIds.map((parentId, index) => {
                        let realParentId = parentId;
                        if (index > 0 && index === parentIds.length - 1 && parentId === Categories.unselectedParent) {
                            realParentId = parentIds[index - 1];
                        }

                        return (
                            <div className={theme.categorySelectWrapper}>
                                <div className={theme.selectLeft}>
                                    <CategoryDropdown
                                        key={`category-select-${index}`}
                                        index={index}
                                        parentId={realParentId}
                                        selectedValue={parentId}
                                        onChangeCategory={this.handleCategorySelect(index)}
                                    />
                                </div>
                                <IconButton aria-label="delete" disabled={index < parentIds.length - 1} onClick={this.handleRemoveCategorySelect}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        );
                    })}
                </div>
                {newCategory
                    && <div className={theme.newCategoryWrapper}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Key"
                            size="small"
                            onChange={this.handleKeyChange}
                        />
                        <TextField
                            variant="outlined"
                            fullWidth
                            style={{ marginLeft: '8px' }}
                            label="Label"
                            size="small"
                            onChange={this.handleLabelChange}
                        />
                        <IconButton aria-label="delete" onClick={this.handleHideNewCategory}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                }
                <div className={theme.actionButtonsWrapper}>
                    <Button variant="contained" color="secondary" disabled={this.isChooseParentButtonDisabled()} fullWidth onClick={this.handleClickChooseParent}>
                        Choose parent
                    </Button>
                    <Button style={{ marginLeft: '8px' }} disabled={this.isNewCategoryButtonDisabled()} variant="contained" color="secondary" fullWidth onClick={this.handleShowNewCategory}>
                        New category
                    </Button>
                </div>
                <Button type="submit" variant="contained" color="primary" disabled={this.isSubmitButtonDisabled()} onClick={this.handleSubmitCreateCategory}>
                    Submit
                </Button>
            </div>
        );
    }

    public render() {
        return (
            <div className={theme.contentBox}>
                <Typography component="h6" variant="h6">
                    Category map
                </Typography>
                <div>
                    <CategoryTree />
                </div>
                <hr className={theme.divider} />
                <Typography component="h6" variant="h6">
                    Create category
                </Typography>
                <div>
                    {this.renderCreationWizard()}
                </div>
            </div>
        );
    }
}
