using System;
using System.Collections.Generic;
using System.Net;
using GalaSoft.MvvmLight.Threading;
using Newtonsoft.Json;
using RestSharp;
using ToDo.Models;

namespace ToDo.Xaml.Clients
{
    public interface IMetaClient
    {
        void Categories(Action<IList<Category>> callbackAction);
        void Priorities(Action<IList<Models.Priority>> callbackAction);
        void Statuses(Action<IList<Models.Status>> callbackAction);
    }

    public class MetaClient : IMetaClient
    {
        public void Categories(Action<IList<Category>> callbackAction)
        {
            var client = new RestClient("http://localhost:8888/ToDoServices/api/meta/categories");
            var request = new RestRequest();

            client.ExecuteAsync(request, (response, handle) =>
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var results = JsonConvert.DeserializeObject<IList<Category>>(response.Content);
                    DispatcherHelper.CheckBeginInvokeOnUI(() => callbackAction.Invoke(results));                    
                }
            });
        }

        public void Priorities(Action<IList<Models.Priority>> callbackAction)
        {
            var client = new RestClient("http://localhost:8888/ToDoServices/api/meta/priorities");
            var request = new RestRequest();

            client.ExecuteAsync<IList<Priority>>(request, (response, handle) =>
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var results = JsonConvert.DeserializeObject<IList<Priority>>(response.Content);
                        DispatcherHelper.CheckBeginInvokeOnUI(() => callbackAction.Invoke(results));
                    }
                });
        }

        public void Statuses(Action<IList<Models.Status>> callbackAction)
        {
            var client = new RestClient("http://localhost:8888/ToDoServices/api/meta/Statuses");
            var request = new RestRequest();

            client.ExecuteAsync<IList<Priority>>(request, (response, handle) =>
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var results = JsonConvert.DeserializeObject<IList<Status>>(response.Content);
                    DispatcherHelper.CheckBeginInvokeOnUI(() => callbackAction.Invoke(results));
                }
            });
        }
    }
}