import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Roles} from 'meteor/alanning:roles';

import {Credentials} from "../../../api/credentials/credentials";
import {activate, toggleStatus} from '../../../api/users/methods';
import {NotificationService} from '../../../startup/services';

import './users.html';

const templateName = 'Admin_users';

Template[templateName].onCreated(function adminAccountsCreated() {
    this.subscribe('admin.users');
});

Template[templateName].helpers({
    users() {
        return Meteor.users.find({
            _id: {
                $ne: Meteor.userId()
            }
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    credentialsCount() {
        return Credentials.find({
            ownerId: this._id
        }).count();
    },
    adminTag() {
        return Roles.userIsInRole(this._id, 'admin') && 'label-info';
    },
    emailNotVerified() {
        return !this.emails[0].verified;
    },
    statusButtonColor() {
        return !!this.disabled ? 'btn-success' : 'btn-danger';
    },
    statusButtonText() {
        return !!this.disabled ? 'Unban' : 'Ban';
    },
});

Template[templateName].events({
    'click .js-status-toggle'() {
        toggleStatus.call({userId: this._id}, (error) => {
            if (error) {
                NotificationService.error(error.toString);
            }
        });
    },
    'click .js-activate'() {
        activate.call({userId: this._id}, (error) => {
            if (error) {
                NotificationService.error(error.toString);
            }
        });
    },
});
