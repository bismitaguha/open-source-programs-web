import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { getUnpublishedForm, deleteUnpublishedForm } from '../actions/form'
import PropTypes from 'prop-types'
import { Card, Icon, Message, Button, Modal, Header } from 'semantic-ui-react'
import '../styles/Form.css'

class UnpublishedForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            formserror: null,
            deleted: false,
            open: false
        }
    }

    componentDidMount() {
        this.props.getUnpublishedForm('False')
    }

    deleteForm = (e, id) => {
        this.props.deleteUnpublishedForm(id, 'False', this.deleteCallback)
        this.setState({
            open: !this.state.open,
        })
    }

    deleteCallback = () => {
        this.setState({
            formserror: this.props.formerror ? true : false,
            deleted: true,
        })
        setTimeout(() => {
            this.setState({
                formserror: null,
                deleted: false,
            })
        }, 5000)
    }

    close = () => {
        this.setState({ open: !this.state.open })
    }

    render() {
        const { unpublishedform } = this.props
        const { formserror, deleted } = this.state
        return (
            <>
            {
                deleted ?
                <Message
                    success
                    content="The form was succesfully deleted."
                />
                : null
            }
            <Card.Group>
                {
                    unpublishedform && unpublishedform.length !== 0 ?
                    unpublishedform.map(unpublishedform =>
                        <Card fluid key={unpublishedform.id}>
                            <Card.Content>
                                <Card.Header>{unpublishedform.name}</Card.Header>
                                <Card.Meta>{unpublishedform.description}</Card.Meta>
                                <div className='card'>
                                    <div className='details'>
                                        <div className='first'>
                                            <span>Published Status: <span className='red'>NO</span></span>
                                            <span>Fields: <span className='blue'>{unpublishedform.form_fields.length}</span></span>
                                        </div>
                                        <div className='center'>
                                            <span>Target User: <span className='blue'>{unpublishedform.target_user.toUpperCase()}</span></span>
                                        </div>
                                        <div className='last'>
                                            <span>Created: <span className='grey'>{moment(new Date(unpublishedform.created_on), "YYYYMMDD").fromNow()}</span></span>
                                            <span>Updated: <span className='grey'>{moment(new Date(unpublishedform.updated_on), "YYYYMMDD").fromNow()}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                            <Card.Content extra>
                                <Button color='green'>PUBLISH</Button>
                                <Button color='blue'>EDIT</Button>
                                <Modal
                                    basic
                                    trigger={<Button negative onClick={this.close}>DELETE</Button>}
                                    open={this.state.open}
                                    size='large'
                                    closeOnDimmerClick={false}
                                    closeOnEscape={false}
                                    onClose={this.close}>
                                        <Header icon='archive' content='Delete Confirmation' />
                                        <Modal.Content>
                                            Deleting this form will delete all the fields and responses related to this form.
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button basic color='red' onClick={this.close}>
                                                <Icon name='remove' /> NO
                                            </Button>
                                            <Button color='green' onClick={(event) => this.deleteForm(event, unpublishedform.id)}>
                                                <Icon name='checkmark' /> YES
                                            </Button>
                                        </Modal.Actions>
                                    </Modal>
                            </Card.Content>
                        </Card>
                        )
                        : 
                        <div>There are no Unpublished Forms.</div>
                }
            </Card.Group>
            </>
        )
    }
}

UnpublishedForm.propTypes = {
    unpublishedform: PropTypes.array.isRequired,
    deleteUnpublishedForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    unpublishedform: state.form.unpublishedform,
    formerror: state.form.formerror
})

export default connect(
    mapStateToProps,
    { getUnpublishedForm, deleteUnpublishedForm }
)(UnpublishedForm)