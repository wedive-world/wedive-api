module.exports = {
    DiveCenter: {
        async aliases(parent, args, context, info) {
            return parent.aliasesString ? parent.aliasesString.split(',') : null
        },

        async searchTerms(parent, args, context, info) {
            return parent.searchTermsString ? parent.searchTermsString.split(',') : null
        }
    },

    DiveSite: {
        async aliases(parent, args, context, info) {
            return parent.aliasesString ? parent.aliasesString.split(',') : null
        },

        async searchTerms(parent, args, context, info) {
            return parent.searchTermsString ? parent.searchTermsString.split(',') : null
        }
    },

    DivePoint: {
        async aliases(parent, args, context, info) {
            return parent.aliasesString ? parent.aliasesString.split(',') : null
        },

        async searchTerms(parent, args, context, info) {
            return parent.searchTermsString ? parent.searchTermsString.split(',') : null
        }
    },

    Interest: {
        async aliases(parent, args, context, info) {
            return parent.aliasesString ? parent.aliasesString.split(',') : null
        },

        async searchTerms(parent, args, context, info) {
            return parent.searchTermsString ? parent.searchTermsString.split(',') : null
        }
    },
}