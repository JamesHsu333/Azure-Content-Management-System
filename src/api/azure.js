import {
    AzureService
} from '../utils/https-request.js'
import {
    subscriptionId
} from '../tenant.js'

/**
 * Gets all the resource groups for a subscription
 * 
 * @function listResourceGroup
 * 
 * @return {Promise} AzureService
 */
export const listResourceGroup = () => {
    return AzureService({
        url: 'subscriptions/' + subscriptionId + '/resourcegroups?api-version=2019-08-01',
        method: 'get'
    })
}
/**
 * Creates or updates a resource group
 * 
 * @function createResourceGroup
 * 
 * @param {Object} resourceGroupParams - TCreates or updates a resource group essential parameters
 * 
 * @param {string} resourceGroupName - The name of the resource group to create or update
 * 
 * @param {string} region - The region you want to assign your resouce group
 */
export const createResourceGroup = ({resourceGroupName, region}) => {
    return AzureService({
        url: 'subscriptions/' + subscriptionId + '/resourcegroups/' + resourceGroupName + '?api-version=2019-08-01',
        method: 'put',
        data: {
            "location": region,
            "tags": {
                "User": resourceGroupName
            }
        }
    })
}
/**
 * Deletes a resource group
 * 
 * @function deleteResourceGroup
 * 
 * @param {string} resourceGroupName 
 */
export const deleteResourceGroup = (resourceGroupName) => {
    return AzureService({
        url: 'subscriptions/' + subscriptionId + '/resourcegroups/' + resourceGroupName + '?api-version=2019-08-01',
        method: 'delete'
    })
}
/**
 * Gets role assignments for a resource group
 * 
 * @function listRoleForRG
 * 
 * @param {string} resourceGroupName - Resource Group Name
 * 
 * @return {Promise} AzureService
 */
export const listRoleForRG = (resourceGroupName) => {
    return AzureService({
        url: 'subscriptions/' + subscriptionId + '/resourcegroups/' + resourceGroupName + '/providers/Microsoft.Authorization/permissions?api-version=2015-07-01',
        method: 'get'
    })
}
/**
 * Get resources in specific resource group
 * 
 * @function listResourceByRG
 * 
 * @param {string} resourceGroupName - Resource Group Name
 * 
 * @return {Promise} AzureService
 */
export const listResourceByRG = (resourceGroupName) => {
    return AzureService({
        url: 'subscriptions/' + subscriptionId + '/resourceGroups/' + resourceGroupName + '/resources?api-version=2019-08-01',
        method: 'get'
    })
}
/**
 * Deletes a resource by ID
 * 
 * @function deleteResourceById
 * 
 * @param {string} resourceId - Resource ID
 * 
 * @return {Promise} AzureService
 */
export const deleteResourceById = (resourceId) => {
    return AzureService({
        url: resourceId + '?api-version=2019-06-01',
        method: 'delete'
    })
}

/**
 * Creates a role assignment in resource group scope
 * 
 * @function createRoleAssignment
 * 
 * @param {Object} roleParams - The role assignment essential parameters
 * 
 * @param {string} roleParams.roleAssignName - The role assignment name Must be GUID form
 * 
 * @param {string} roleParams.roleDefinitionId - The role definition ID (GUID) used in the role assignment 
 * 
 * @param {string} roleParams.userId - The user ID assigned to the role 
 * 
 * @param {string} roleParams.resourceGroupName The resource group of the role assignment to create
 * 
 * @return {Promise} AzureService
 */
export const createRoleAssignment = ({
    roleAssignName,
    roleDefinitionId,
    userId,
    resourceGroupName
}) => {
    return AzureService({
        url: '/subscriptions/' + subscriptionId + '/resourceGroups/' + resourceGroupName + '/providers/Microsoft.Authorization/roleAssignments/' + roleAssignName + '?api-version=2015-07-01',
        method: 'put',
        data: {
            "properties": {
                "roleDefinitionId": "/subscriptions/" + subscriptionId + "/providers/Microsoft.Authorization/roleDefinitions/" + roleDefinitionId,
                "principalId": userId
            }
        }
    })
}

/**
 * Deletes a role assignment
 * 
 * @function deleteRoleAssignment
 * 
 * @param {string} roleAssignName - The role assignment name Must be GUID form
 * 
 * @param {string} resourceGroupName - The resource group of the role assignment to create
 * 
 * @return {Promise} AzureService
 */
export const deleteRoleAssignment = (roleAssignName, resourceGroupName) => {
    return AzureService({
        url: '/subscriptions/' + subscriptionId + '/resourceGroups/' + resourceGroupName + '/providers/Microsoft.Authorization/roleAssignments/' + roleAssignName + '?api-version=2015-07-01',
        method: 'delete'
    })
}