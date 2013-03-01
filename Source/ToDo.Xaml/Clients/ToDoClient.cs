using System;
using System.Collections.Generic;
using System.Net;
using System.Windows;
using GalaSoft.MvvmLight.Threading;
using Newtonsoft.Json;
using RestSharp;

namespace ToDo.Xaml.Clients
{
    public interface IToDoClient
    {
        void SchduledToDos( Action<IList<Models.ToDo>> results );
        void DeleteToDo(int idToDelete, Action<bool> callbackAction);
        void UpdateToDo(Models.ToDo toDo, Action<bool> callbackAction);
    }

    public class ToDoClient : IToDoClient
    {
        public void SchduledToDos( Action<IList<Models.ToDo>> callbackAction )
        {
            var client = new RestClient("http://localhost:8888/ToDoServices/api/ToDo");
            var request = new RestRequest();

            client.ExecuteAsync(request, (response, handle) =>
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        var results = JsonConvert.DeserializeObject<IList<Models.ToDo>>(response.Content);

                        DispatcherHelper.CheckBeginInvokeOnUI(() =>
                        {
                            callbackAction.Invoke(results);
                        });
                    }
                });
        }

        public void DeleteToDo( int idToDelete, Action<bool> callbackAction)
        {
            var url = string.Format("http://localhost:8888/ToDoServices/api/ToDo/Delete/{0}", idToDelete);
            var client = new RestClient(url);
            var request = new RestRequest(Method.DELETE);

            client.ExecuteAsync(request, (response, handle) =>
                {
                    if (response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NoContent)
                    {
                        DispatcherHelper.CheckBeginInvokeOnUI(() => callbackAction.Invoke(true));
                    }
                    else
                    {
                        callbackAction.Invoke(false);
                    }
                });
        }

        public void UpdateToDo(Models.ToDo toDo, Action<bool> callbackAction)
        {
            var client = new RestClient("http://localhost:8888/ToDoServices/api/ToDo/Update");
            var request = new RestRequest(Method.POST);
            request.AddObject(toDo);
            

            client.ExecuteAsync(request, (response, handle) =>
            {
                if (response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NoContent)
                {
                    DispatcherHelper.CheckBeginInvokeOnUI(() => callbackAction.Invoke(true));
                }
                else
                {
                    callbackAction.Invoke(false);
                }
            });
        }

    }
}
