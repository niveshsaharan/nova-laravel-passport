<template>
    <div>
        <div class="flex mb-6">
        <h1 class="text-90 font-normal text-2xl">Personal Access Tokens</h1>
            <div class="flex-no-shrink ml-auto">
                <a href="javascript:void(0);"
                   @click="toggleCreateTokenForm" class="btn btn-default btn-primary">
                Create New Token
            </a></div>
        </div>
        <card>
            <table class="table table-borderless mb-0" width="100%" v-if="tokens.length">
                <thead>
                <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Created At</th>
                    <th class="text-left">Expires At</th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="token in tokens">
                    <td style="vertical-align: middle;">
                        <strong>{{ token.name }}</strong>
                    </td>
                    <td style="vertical-align: middle;">
                        {{ token.created_at }}
                    </td>
                    <td style="vertical-align: middle;">
                        {{ token.expires_at }}
                    </td>
                    <td style="vertical-align: middle;">
                        <a href="javascript:void(0);" class="action-link text-danger" @click="revoke(token)">
                            Revoke
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="card" v-else>
                <div class="relative">
                    <div class="flex justify-center items-center px-6 py-8" style="">
                        <div class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="51" viewBox="0 0 65 51" class="mb-3">
                                <path fill="#A8B9C5"
                                      d="M56 40h2c.552285 0 1 .447715 1 1s-.447715 1-1 1h-2v2c0 .552285-.447715 1-1 1s-1-.447715-1-1v-2h-2c-.552285 0-1-.447715-1-1s.447715-1 1-1h2v-2c0-.552285.447715-1 1-1s1 .447715 1 1v2zm-5.364125-8H38v8h7.049375c.350333-3.528515 2.534789-6.517471 5.5865-8zm-5.5865 10H6c-3.313708 0-6-2.686292-6-6V6c0-3.313708 2.686292-6 6-6h44c3.313708 0 6 2.686292 6 6v25.049375C61.053323 31.5511 65 35.814652 65 41c0 5.522847-4.477153 10-10 10-5.185348 0-9.4489-3.946677-9.950625-9zM20 30h16v-8H20v8zm0 2v8h16v-8H20zm34-2v-8H38v8h16zM2 30h16v-8H2v8zm0 2v4c0 2.209139 1.790861 4 4 4h12v-8H2zm18-12h16v-8H20v8zm34 0v-8H38v8h16zM2 20h16v-8H2v8zm52-10V6c0-2.209139-1.790861-4-4-4H6C3.790861 2 2 3.790861 2 6v4h52zm1 39c4.418278 0 8-3.581722 8-8s-3.581722-8-8-8-8 3.581722-8 8 3.581722 8 8 8z"></path>
                            </svg>
                            <h3 class="text-base text-80 font-normal mb-6">
                                No token found.
                            </h3>
                            <div>
                                <a href="javascript:void(0);"
                                   @click="toggleCreateTokenForm"
                                    class="btn btn-sm btn-outline inline-flex items-center">
                                Create New Token
                            </a></div>
                        </div>
                    </div>
                    <div class="overflow-hidden overflow-x-auto relative"><!----></div> <!----></div>
            </div>
        </card>

        <modal v-if="createModal">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden w-action-fields">
                <div>

                    <h2 class="border-b border-40 py-8 px-8 text-90 font-normal text-xl">Create New Token</h2>

                    <div class="flex border-b border-40">
                        <div class="w-1/4 py-6 px-8">
                            <label class="inline-block text-80 pt-2 leading-tight"
                                   for="token-name">
                                Token Name
                            </label>
                        </div>
                        <div class="py-6 px-8 w-1/2">
                            <input
                                    v-model="form.name"
                                    id="token-name" type="text"
                                    class="w-full form-control form-input form-input-bordered"
                                    placeholder="My API token" autofocus required>
                            <div class="help-text help-text mt-2"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-30 px-6 py-3 flex">
                    <div class="flex items-center ml-auto">
                        <button @click="createModal = false" type="button" class="btn text-80 font-normal h-9 px-3 mr-3 btn-link">
                            Cancel
                        </button>
                        <button type="button" @click="createToken"  class="btn btn-default btn-primary"><span>Create</span></button>
                    </div>
                </div>
            </div>


        </modal>


        <modal v-if="accessToken">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden w-action-fields">
                <div>

                    <h2 class="border-b border-40 py-6 px-8 text-90 font-normal text-xl">Personal Access Token</h2>

                    <div class="text-80 pt-2 leading-tight mb-2 px-8">Here is your new personal access token. This is the only time it will be shown so don't lose it! You may now use this token to make
                        API
                        requests.

                    </div>
                    <div class="flex border-b border-40 px-8">
                        <textarea rows="20"
                                readonly
                                class="p-2 w-full form-text form-input-bordered"
                                placeholder="My API token" autofocus required>{{accessToken}}</textarea>
                    </div>
                </div>
                <div class="bg-30 px-6 py-3 flex">
                    <div class="flex items-center ml-auto">
                        <button type="button" @click="accessToken = null"  class="btn btn-default btn-primary"><span>Done</span></button>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

export default {
    /*
     * The component's data.
     */
    data()
    {
        return {
            accessToken: null,
            tokens: [],
            form: {
                name: '',
                scopes: [],
            },
            createModal: false,
        };
    },

    mounted() {
        this.prepareComponent();
    },
    methods:{
        /**
         * Prepare the component.
         */
        prepareComponent()
        {
            this.getTokens();
        },

        /**
         * Get all of the personal access tokens for the user.
         */
        getTokens()
        {
            axios.get( '/oauth/personal-access-tokens' )
                .then( response => {
                    this.tokens = response.data;
                } );
        },

        /**
         * Revoke the given token.
         */
        revoke( token )
        {
            axios.delete( '/oauth/personal-access-tokens/' + token.id )
                .then( response => {
                    this.getTokens();
                } );
        },

        /**
         * Create a new personal access token.
         */
        createToken()
        {
            this.accessToken = null;

            axios.post( '/oauth/personal-access-tokens', this.form )
                .then( response => {
                    this.form.name = '';
                    this.form.scopes = [];
                    this.form.errors = [];

                    this.tokens.push( response.data.token );

                    this.showAccessToken( response.data.accessToken );
                } )
                .catch( error => {
                    if( typeof error.response.data === 'object' )
                    {
                        alert(_.flatten( _.toArray( error.response.data.errors ) ));
                    }
                    else
                    {
                        alert('Something went wrong. Please try again.');
                    }
                } );
        },

        /**
         * Show the given access token to the user.
         */
        showAccessToken( accessToken )
        {
            this.createModal = false;
            this.accessToken = accessToken;
        },

        toggleCreateTokenForm(){
            this.createModal = ! this.createModal;
        }
    }
}
</script>

<style>
/* Scoped Styles */
</style>
