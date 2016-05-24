AutoForm.addHooks('addCredentials', {
    onSubmit: function(doc) {
        this.event.preventDefault();
        var self = this;

        var password = doc.password;
        var masterKey = Session.get('masterKey');

        if (!masterKey) {
            this.done(new Error('Cannot encrypt data. Master key missing'));
            return;
        }

        doc.iv = EncryptionService.generateKey(128);
        doc.password = EncryptionService.encrypt(password, masterKey, doc.iv);

        Meteor.call("insertCredentials", doc, function(error) {
            self.done(error);
        });
    },
    onSuccess: function() {
        throwAlert('Credentials successfully added', 'success');
        Router.go('credentials');
    }
});