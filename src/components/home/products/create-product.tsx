import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import * as theme from './products.scss';

interface Props {
    authToken: string;
}

interface State {
    productBody: {
        title: string;
        desription: string;
        price: string;
        quantityInStock: string;
        tags: string;
    };
}

export class CreateProduct extends React.PureComponent<Props, State> {
    public state: State = {
        productBody: {
            title: '',
            desription: '',
            price: '',
            quantityInStock: '',
            tags: ''
        }
    };

    private handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        this.setState((prevState) => ({
            productBody: {
                ...prevState.productBody,
                [field]: event.target.value
            }
        } as Pick<State, any>));
    }

    private handleSubmit = () => {
        console.log(this.state.productBody);
    }

    public render() {
        // const { productBody } = this.state;

        return (
            <div className={theme.contentBox}>
                <Typography component="h6" variant="h6">
                    Create product
                </Typography>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Title"
                                onChange={this.handleInputChange('title')}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Description"
                                onChange={this.handleInputChange('description')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Price"
                                onChange={this.handleInputChange('price')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Quantity in Stock"
                                onChange={this.handleInputChange('quantityInStock')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Tags"
                                onChange={this.handleInputChange('tags')}
                            />
                        </Grid>
                    </Grid>
                    <div className={theme.submitWrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
